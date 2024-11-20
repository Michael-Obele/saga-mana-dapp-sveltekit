import { prisma } from './db';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';

export const signUp = async (formData: FormData) => {
	const username = formData.get('username') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const nearId = formData.get('nearId') as string;

	let passwordHash = await bcrypt.hash(password, 10);

	try {
		await prisma.user.create({
			data: {
				username: username,
				email: email,
				password: passwordHash as string,
				nearId: nearId
			}
		});
		console.info('User created successfully');
		return { success: true };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.error('Username or email already exists');
				return { success: false, message: 'Username or email already exists' };
			}
		}
		return { success: false, message: 'Unknown error' };
	}
};

export const logIn = async (formData: FormData, cookies: Cookies) => {
	const username = formData.get('username') as string;
	const password = formData.get('password') as string;
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: username
			},
			select: {
				username: true,
				email: true,
				password: true
			}
		});

		if (user?.password) {
			const userPassword = bcrypt.compareSync(password, user.password);
			if (!userPassword) {
				console.error('Invalid email or password');
				return { success: false, message: 'Invalid email or password' };
			}
		} else {
			console.error('Invalid email or password');
			return { success: false, message: 'Invalid email or password' };
		}

		const authenticatedUser = await prisma.user.update({
			where: { username: formData.get('username') as string },
			data: { authToken: crypto.randomUUID() }
		});

		if (user) {
			cookies.set('session', authenticatedUser.authToken ?? '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7,
				path: '/'
			});

			return { success: true, user };
		} else {
			return { success: false, message: 'Invalid email or password' };
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Unknown error' };
	}
};

export const logOut = async (cookies: Cookies) => {
	try {
		cookies.set('session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60,
			path: '/'
		});
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Unknown error' };
	}
};

export const authenticate = async (cookies: Cookies) => {
	const sessionCookie = cookies.get('session');

	try {
		const user = await prisma.user.findUnique({
			where: {
				authToken: sessionCookie
			},
			select: {
				username: true,
				email: true,
				password: true
			}
		});
		if (user) {
			return { success: true, user };
		} else {
			return { success: false, message: 'Invalid email or password' };
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Unknown error' };
	}
};

export const createProject = async (formData: FormData) => {
	const title = formData.get('title') as string;
	const description = formData.get('description') as string;
	const manaTokenAllocated = parseFloat(formData.get('manaTokenAllocated') as string) || 0;
	const manaHoursBudgeted = parseInt(formData.get('manaHoursBudgeted') as string, 10) || 0;
	const submittedBy = formData.get('submittedBy') as string;
	const targetApprovalDate = formData.get('targetApprovalDate')
		? new Date(formData.get('targetApprovalDate') as string)
		: null;
	const budgetWindowLow = parseFloat(formData.get('budgetWindowLow') as string) || 0;
	const budgetWindowHigh = parseFloat(formData.get('budgetWindowHigh') as string) || 0;

	try {
		await prisma.proposal.create({
			data: {
				title,
				description,
				manaTokenAllocated,
				manaHoursBudgeted,
				submittedBy,
				targetApprovalDate,
				budgetWindowLow,
				budgetWindowHigh
			}
		});
		console.info('Project created successfully');
		return { success: true, message: 'Project created successfully!' };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.error('Project already exists');
				return { success: false, message: 'Project already exists' };
			}
		}
		console.error(error);
		return { success: false, message: 'Unknown error' };
	}
};

export const fetchUserProposals = async (username: string) => {
	try {
		const userProposals = await prisma.proposal.findMany({
			where: {
				submittedBy: username
			}
		});

		if (userProposals.length === 0) {
			return { success: true, message: 'No proposals found for this user', proposals: [] };
		}

		return { success: true, proposals: userProposals };
	} catch (error) {
		console.error('Error fetching user proposals:', error);
		return { success: false, message: 'Unknown error' };
	}
};

export interface SubProjectFormData {
	proposalId: string;
	subProjectName: string;
	epics: {
		epicName: string;
		tasks: {
			taskName: string;
			manaTokenAllocated: number;
			rolesManaHours: { roleName: string; manaHours: number }[];
		}[];
	}[];
}

export const createSubProject = async (formData: SubProjectFormData) => {
	try {
		const result = await prisma.subProject.create({
			data: {
				proposal: { connect: { id: parseInt(formData.proposalId) } },
				subProjectName: formData.subProjectName,
				epics: {
					create: formData.epics.map((epic) => ({
						epicName: epic.epicName,
						tasks: {
							create: epic.tasks.map((task) => ({
								taskName: task.taskName,
								manaTokenAllocated: task.manaTokenAllocated,
								rolesManaHours: {
									create: task.rolesManaHours.map((role) => ({
										roleName: role.roleName,
										manaHours: role.manaHours
									}))
								}
							}))
						}
					}))
				}
			},
			include: {
				epics: {
					include: {
						tasks: {
							include: {
								rolesManaHours: true
							}
						}
					}
				}
			}
		});

		console.info('Sub-Project created successfully');
		return { success: true, message: 'Sub-Project created successfully!', data: result };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				console.error('Sub-Project already exists');
				return { success: false, message: 'Sub-Project already exists' };
			}
		}
		console.error(error);
		return { success: false, message: 'Unknown error' };
	}
};

import type { Proposal, SubProject, Epic, Task, RolesManaHour } from '@prisma/client';

export type DetailedTask = Task & {
	rolesManaHours: RolesManaHour[];
};

export type DetailedEpic = Epic & {
	tasks: DetailedTask[];
};

export type DetailedSubProject = SubProject & {
	epics: DetailedEpic[];
};

export type DetailedProposal = Proposal & {
	subProjects: DetailedSubProject[];
};

export type FetchUserProposalsWithDetailsResponse = {
	success: boolean;
	message?: string;
	proposals?: DetailedProposal[];
};

export const fetchUserProposalsWithDetails = async (
	username: string
): Promise<FetchUserProposalsWithDetailsResponse> => {
	try {
		const userProposals = await prisma.proposal.findMany({
			where: {
				submittedBy: username
			},
			include: {
				subProjects: {
					include: {
						epics: {
							include: {
								tasks: {
									include: {
										rolesManaHours: true
									}
								}
							}
						}
					}
				}
			}
		});

		if (userProposals.length === 0) {
			return {
				success: true,
				message: 'No proposals found for this user',
				proposals: []
			};
		}

		return { success: true, proposals: userProposals };
	} catch (error) {
		console.error('Error fetching user proposals with details:', error);
		return { success: false, message: 'Unknown error', proposals: [] };
	}
};

export const createSubProjectVote = async (data: {
	subProjectId: number;
	voterId: string;
	vote: boolean;
}) => {
	try {
		const newVote = await prisma.subProjectVote.create({ data });
		return newVote;
	} catch (error) {
		console.error('Error creating subproject vote:', error);
		throw error;
	}
};

export const createTaskPerformanceVote = async (data: {
	taskId: number;
	voterId: string;
	voteeId: string;
	vote: boolean;
}) => {
	try {
		const newVote = await prisma.taskPerformanceVote.create({ data });
		return newVote;
	} catch (error) {
		console.error('Error creating task performance vote:', error);
		throw error;
	}
};
