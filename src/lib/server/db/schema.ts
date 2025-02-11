import { relations } from 'drizzle-orm/relations';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const questions = sqliteTable('questions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	creator: text('creator').notNull(), // session token
	content: text('content').notNull().unique()
});

export const answers = sqliteTable('answers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	creator: text('creator').notNull(), // session token
	content: text('content').notNull(),
	questionId: text('question_id').references(() => questions.id)
});

// Relations
export const questionsRelations = relations(questions, ({ many }) => ({
	answers: many(answers)
}));
