import { pgTable, serial, text, varchar, timestamp, boolean, integer, real, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  authToken: varchar('auth_token').unique(),
  nearId: varchar('near_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  description: text('description').notNull(),
  yesVotes: integer('yes_votes').default(0).notNull(),
  noVotes: integer('no_votes').default(0).notNull(),
  manaTokenAllocated: real('mana_token_allocated').notNull(),
  isEnded: boolean('is_ended').default(false).notNull(),
  submittedBy: varchar('submitted_by').notNull(),
  manaHoursBudgeted: integer('mana_hours_budgeted').notNull(),
  targetApprovalDate: timestamp('target_approval_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  budgetWindowLow: real('budget_window_low').notNull(),
  budgetWindowHigh: real('budget_window_high').notNull()
});

export const subProjects = pgTable('sub_projects', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id').notNull().references(() => proposals.id),
  subProjectName: varchar('sub_project_name').notNull()
});

export const epics = pgTable('epics', {
  id: serial('id').primaryKey(),
  subProjectId: integer('sub_project_id').notNull().references(() => subProjects.id),
  epicName: varchar('epic_name').notNull()
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  epicId: integer('epic_id').notNull().references(() => epics.id),
  taskName: varchar('task_name').notNull(),
  manaTokenAllocated: real('mana_token_allocated').notNull()
});

export const rolesManaHours = pgTable('roles_mana_hours', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  roleName: varchar('role_name').notNull(),
  manaHours: integer('mana_hours').notNull()
});

export const subProjectVotes = pgTable('sub_project_votes', {
  id: serial('id').primaryKey(),
  subProjectId: integer('sub_project_id').notNull().references(() => subProjects.id),
  voterId: varchar('voter_id').notNull(),
  vote: boolean('vote')
});

export const taskPerformanceVotes = pgTable('task_performance_votes', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  voterId: varchar('voter_id').notNull(),
  voteeId: varchar('votee_id').notNull(),
  vote: boolean('vote')
});

// Relations
export const proposalsRelations = relations(proposals, ({ many }) => ({
  subProjects: many(subProjects)
}));

export const subProjectsRelations = relations(subProjects, ({ one, many }) => ({
  proposal: one(proposals, {
    fields: [subProjects.proposalId],
    references: [proposals.id]
  }),
  epics: many(epics),
  votes: many(subProjectVotes)
}));

export const epicsRelations = relations(epics, ({ one, many }) => ({
  subProject: one(subProjects, {
    fields: [epics.subProjectId],
    references: [subProjects.id]
  }),
  tasks: many(tasks)
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  epic: one(epics, {
    fields: [tasks.epicId],
    references: [epics.id]
  }),
  rolesManaHours: many(rolesManaHours),
  votes: many(taskPerformanceVotes)
}));

export const rolesManaHoursRelations = relations(rolesManaHours, ({ one }) => ({
  task: one(tasks, {
    fields: [rolesManaHours.taskId],
    references: [tasks.id]
  })
}));

export const subProjectVotesRelations = relations(subProjectVotes, ({ one }) => ({
  subProject: one(subProjects, {
    fields: [subProjectVotes.subProjectId],
    references: [subProjects.id]
  })
}));

export const taskPerformanceVotesRelations = relations(taskPerformanceVotes, ({ one }) => ({
  task: one(tasks, {
    fields: [taskPerformanceVotes.taskId],
    references: [tasks.id]
  })
}));


export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});


export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

