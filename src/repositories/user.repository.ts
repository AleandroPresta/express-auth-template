/**
 * User repository
 * Handles database operations for users
 */

import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateUserData {
    email: string;
    password: string;
    username?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
}

export interface UpdateUserData {
    username?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
}

export class UserRepository {
    /**
     * Create a new user
     */
    async create(userData: CreateUserData): Promise<User> {
        return prisma.user.create({
            data: userData,
        });
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Find user by username
     */
    async findByUsername(username: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { username },
        });
    }

    /**
     * Update user by ID
     */
    async updateById(id: string, userData: UpdateUserData): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: userData,
        });
    }

    /**
     * Delete user by ID
     */
    async deleteById(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return !!user;
    }

    /**
     * Check if username exists
     */
    async usernameExists(username: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        return !!user;
    }
}
