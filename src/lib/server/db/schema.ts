import { relations } from 'drizzle-orm/relations';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const questions = sqliteTable('questions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	creator: text('creator').notNull(),
	content: text('content').notNull().unique(),
	answerCount: integer('answer_count').notNull().default(0),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

export const answers = sqliteTable('answers', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => nanoid()),
	creator: text('creator').notNull(),
	content: text('content').notNull(),
	questionId: text('question_id')
		.notNull()
		.references(() => questions.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date())
});

// Indexes
export const questionsIndexes = {
	answerCountIdx: `CREATE INDEX idx_questions_answer_count ON questions (answer_count)`,
	creatorIdx: `CREATE INDEX idx_questions_creator ON questions (creator)`
};

export const answersIndexes = {
	questionIdIdx: `CREATE INDEX idx_answers_question_id ON answers (question_id)`,
	creatorIdx: `CREATE INDEX idx_answers_creator ON answers (creator)`
};

// Relations
export const questionsRelations = relations(questions, ({ many }) => ({
	answers: many(answers)
}));
