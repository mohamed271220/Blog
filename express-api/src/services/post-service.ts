import MediaLink from "../models/mediaLink";
import Post from "../models/post";
import PostCategory from "../models/postCategory";
import PostTag from "../models/postTag";
import PostView from "../models/postView";
import { v4 as uuid } from "uuid";
import { CustomError } from "../utils/CustomError";
import { Op, Sequelize, Transaction } from "sequelize";
import Category from "../models/category";
import Tag from "../models/tag";
import seqConfig from "../config/database";
import { getPagination, Pagination } from "../utils/pagination";
import User from "../models/user";
import Vote from "../models/vote";

export class PostService {
  constructor(
    private sequelize: Sequelize = seqConfig,
    private userRepository: typeof User = User,
    private postRepository: typeof Post = Post,
    private postViewRepository: typeof PostView = PostView,
    private postTagRepository: typeof PostTag = PostTag,
    private postCategoryRepository: typeof PostCategory = PostCategory,
    private mediaLinkRepository: typeof MediaLink = MediaLink,
    private tagRepository: typeof Tag = Tag,
    private categoryRepository: typeof Category = Category,
    private voteRepository: typeof Vote = Vote
  ) {}

  async createPost(data: {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
    categories?: string[];
    mediaLinks?: string[];
  }) {
    const transaction = await this.sequelize.transaction();

    try {
      // Check if tags are valid if they are provided
      if (data.tags && data.tags.length > 0) {
        const tags = await this.tagRepository.findAll({
          where: { id: data.tags },
        });

        if (tags.length !== data.tags.length) {
          throw new CustomError("Some tags are invalid", 400);
        }
      }

      // Check if categories are valid if they are provided
      if (data.categories && data.categories.length > 0) {
        const categories = await this.categoryRepository.findAll({
          where: { id: data.categories },
        });

        if (categories.length !== data.categories.length) {
          throw new CustomError("Some categories are invalid", 400);
        }
      }

      // Create the post
      const post = await this.postRepository.create(
        {
          id: uuid(),
          title: data.title,
          content: data.content,
          authorId: data.authorId,
        },
        { transaction }
      );

      // Ensure the post was created
      if (!post) {
        throw new CustomError("Failed to create post", 500);
      }

      // Associate tags with the post if provided
      if (data.tags && data.tags.length > 0) {
        await this.postTagRepository.bulkCreate(
          data.tags.map((tag) => ({ postId: post.id, tagId: tag })),
          { transaction }
        );
      }

      // Associate categories with the post if provided
      if (data.categories && data.categories.length > 0) {
        await this.postCategoryRepository.bulkCreate(
          data.categories.map((category) => ({
            postId: post.id,
            categoryId: category,
          })),
          { transaction }
        );
      }
      console.log(data.mediaLinks);

      // Associate media links with the post if provided
      if (data.mediaLinks && data.mediaLinks.length > 0) {
        await this.mediaLinkRepository.bulkCreate(
          data.mediaLinks.map((mediaLink) => ({
            id: uuid(),
            postId: post.id,
            url: mediaLink,
            type: "image",
          })),
          { transaction }
        );
      }

      await transaction.commit();
      return post;
    } catch (error: any) {
      await transaction.rollback();
      throw new CustomError(`Failed to create post: ${error.message}`);
    }
  }

  async getAllPosts(
    limit: number,
    offset: number,
    querySearch: string
  ): Promise<{
    posts: (Post & { upvotes: number })[];
    pagination: Pagination;
  }> {
    const whereClause: any = {};

    if (querySearch) {
      whereClause.title = { [Op.iLike]: `%${querySearch}%` };
    }

    const count = await this.postRepository.count({
      where: whereClause,
    });

    const posts = await this.postRepository.findAll({
      limit,
      offset,
      where: whereClause,
      include: [
        {
          model: this.userRepository,
          attributes: ["id", "email", "username"],
        },
        { model: this.tagRepository },
        { model: this.categoryRepository },
        { model: this.mediaLinkRepository },
      ],
    });

    // get the number of upvotes for each post
    const postIds = posts.map((post) => post.id);
    const votes = await this.voteRepository.findAll({
      where: { postId: { [Op.in]: postIds }, type: "upvote" },
      attributes: ["postId", [Sequelize.fn("COUNT", "postId"), "upvotes"]],
      group: ["postId"],
    });

    // Create a map of postId to upvotes
    const voteMap = votes.reduce((acc, vote) => {
      acc[vote.postId] = vote.get("upvotes") as number;
      return acc;
    }, {} as Record<string, number>);

    // Add the upvotes to the posts
    const postsWithVotes = posts.map((post) => {
      const upvotes = voteMap[post.id] ?? 0;
      return { ...post.toJSON(), upvotes } as Post & { upvotes: number };
    });

    const pagination = getPagination(count, limit, offset);
    return { posts: postsWithVotes, pagination };
  }

  async getFeed(userId: string, limit: number, offset: number) {
    // Get the posts the user has interacted with
    const views = await this.postViewRepository.findAll({ where: { userId } });
    const votes = await this.voteRepository.findAll({
      where: { userId, type: "upvote" },
    });

    // Get the unique post IDs from the views and votes
    const postIds = [
      ...new Set([
        ...views.map((view) => view.postId),
        ...votes.map((vote) => vote.postId),
      ]),
    ];

    // Perform a count query
    const count = await this.postRepository.count({
      where: { id: { [Op.in]: postIds } },
    });

    // Fetch posts that match the user's interacted posts
    const posts = await this.postRepository.findAll({
      limit,
      offset,
      where: { id: { [Op.in]: postIds } },
      include: [
        {
          model: this.userRepository,
          attributes: ["id", "email", "username"],
        },
        {
          model: this.mediaLinkRepository,
        },
      ],
    });

    const votesOfPosts = await this.voteRepository.findAll({
      where: { postId: { [Op.in]: postIds }, type: "upvote" },
      attributes: ["postId", [Sequelize.fn("COUNT", "postId"), "upvotes"]],
      group: ["postId"],
    });

    // Create a map of postId to upvotes
    const voteMap = votesOfPosts.reduce((acc, vote) => {
      acc[vote.postId] = vote.get("upvotes") as number;
      return acc;
    }, {} as Record<string, number>);

    // Add the upvotes to the posts
    const postsWithVotes = posts.map((post) => {
      const upvotes = voteMap[post.id] ?? 0;
      return { ...post.toJSON(), upvotes } as Post & { upvotes: number };
    });

    // Handle pagination
    const pagination = getPagination(count, limit, offset);
    return { posts: postsWithVotes, pagination };
  }

  async getPostById(postId: string, userId: string | null) {
    await this.postViewRepository.create({
      id: uuid(),
      postId,
      userId,
      viewedAt: new Date(),
    });
    const post = await this.postRepository.findByPk(postId, {
      include: [
        {
          model: this.userRepository,
          attributes: ["id", "email", "username"],
        },
        { model: this.tagRepository },
        { model: this.categoryRepository },
        { model: this.mediaLinkRepository },
      ],
    });
    return post;
  }

  async getPostsByAuthor(authorId: string, limit: number, offset: number) {
    const author = await this.userRepository.findByPk(authorId);
    if (!author) {
      throw new CustomError("Author not found", 404);
    }
    const { count, rows: posts } = await this.postRepository.findAndCountAll({
      limit,
      offset,
      where: { authorId },
      include: [
        {
          model: this.userRepository,
          attributes: ["id", "email", "username"],
        },
        { model: this.tagRepository },
        { model: this.categoryRepository },
        { model: this.mediaLinkRepository },
      ],
    });
    const pagination = getPagination(count, limit, offset);
    return { posts, pagination };
  }

  async getPostsByCategory(categoryId: string, limit: number, offset: number) {
    const category = await this.categoryRepository.findByPk(categoryId);
    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // Perform a count query without the include option
    const count = await this.postCategoryRepository.count({
      where: { categoryId },
    });

    // Perform the findAll query with the include option
    const posts = await this.postCategoryRepository.findAll({
      offset,
      limit,
      where: { categoryId },
      include: [
        {
          model: this.postRepository,
          include: [
            {
              model: this.userRepository,
              attributes: ["id", "email", "username"],
            },
            { model: this.tagRepository },
            { model: this.mediaLinkRepository },
          ],
        },
      ],
    });

    const pagination = getPagination(count, limit, offset);
    return { posts, pagination };
  }

  async getPostsByTag(tagId: string, limit: number, offset: number) {
    const tag = await this.tagRepository.findByPk(tagId);
    if (!tag) {
      throw new CustomError("Tag not found", 404);
    }

    // Perform a count query without the include option
    const count = await this.postTagRepository.count({
      where: { tagId },
    });

    // Perform the findAll query with the include option
    const posts = await this.postTagRepository.findAll({
      offset,
      limit,
      where: { tagId },
      include: [
        {
          model: this.postRepository,
          include: [
            {
              model: this.userRepository,
              attributes: ["id", "email", "username"],
            },
            { model: this.tagRepository },
            { model: this.categoryRepository },
            { model: this.mediaLinkRepository },
          ],
        },
      ],
    });

    const pagination = getPagination(count, limit, offset);
    return { posts, pagination };
  }

  async updatePost(
    userId: string,
    postId: string,
    data: {
      title?: string;
      content?: string;
      tags?: string[];
      categories?: string[];
      mediaLinks?: string[];
    }
  ) {
    const transaction = await this.sequelize.transaction();

    try {
      // Fetch the existing post
      const post = await this.postRepository.findByPk(postId, {
        // include: [
        //   { model: this.postTagRepository, attributes: ["tagId"] },
        //   { model: this.postCategoryRepository, attributes: ["categoryId"] },
        // ],
      });

      if (!post) {
        throw new CustomError("Post not found", 404);
      }

      // Check if the user is the author of the post
      if (post.authorId !== userId) {
        throw new CustomError("You are not authorized to edit this post", 403);
      }

      // Update the post details
      await post.update(
        {
          title: data.title ?? post.title,
          content: data.content ?? post.content,
        },
        { transaction }
      );

      // Check if tags are valid if they are provided
      if (data.tags && data.tags.length > 0) {
        const tags = await this.tagRepository.findAll({
          where: { id: data.tags },
        });

        if (tags.length !== data.tags.length) {
          throw new CustomError("Some tags are invalid", 400);
        }
      }

      // Check if categories are valid if they are provided
      if (data.categories && data.categories.length > 0) {
        const categories = await this.categoryRepository.findAll({
          where: { id: data.categories },
        });

        if (categories.length !== data.categories.length) {
          throw new CustomError("Some categories are invalid", 400);
        }
      }

      // Update tags if provided
      if (data.tags) {
        await this.postTagRepository.destroy({
          where: { postId: post.id },
          transaction,
        });

        await this.postTagRepository.bulkCreate(
          data.tags.map((tag) => ({ postId: post.id, tagId: tag })),
          { transaction }
        );
      }

      // Update categories if provided
      if (data.categories) {
        await this.postCategoryRepository.destroy({
          where: { postId: post.id },
          transaction,
        });

        await this.postCategoryRepository.bulkCreate(
          data.categories.map((category) => ({
            postId: post.id,
            categoryId: category,
          })),
          { transaction }
        );
      }

      // Update media links if provided
      if (data.mediaLinks) {
        await this.mediaLinkRepository.destroy({
          where: { postId: post.id },
          transaction,
        });

        await this.mediaLinkRepository.bulkCreate(
          data.mediaLinks.map((mediaLink) => ({
            id: uuid(),
            postId: post.id,
            url: mediaLink,
            type: "image",
          })),
          { transaction }
        );
      }

      await transaction.commit();
      return post;
    } catch (error: any) {
      await transaction.rollback();
      throw new CustomError(`Failed to update post: ${error.message}`);
    }
  }

  async deletePost(postId: string, userId: string) {
    const transaction = await this.sequelize.transaction();

    try {
      // Fetch the existing post
      const post = await this.postRepository.findByPk(postId);

      if (!post) {
        throw new CustomError("Post not found", 404);
      }

      // Check if the user is the author of the post
      if (post.authorId !== userId) {
        throw new CustomError(
          "You are not authorized to delete this post",
          403
        );
      }

      // Delete the post
      await post.destroy({ transaction });

      await transaction.commit();
      return post;
    } catch (error: any) {
      await transaction.rollback();
      throw new CustomError(`Failed to delete post: ${error.message}`);
    }
  }
}
