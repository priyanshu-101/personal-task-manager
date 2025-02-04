import { pgTable, serial, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ✅ Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Projects Table
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Tasks Table
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in-progress, completed
  priority: integer("priority").notNull().default(1), // 1 = Low, 2 = Medium, 3 = High
  dueDate: timestamp("due_date"),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Categories Table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
});

// ✅ Task-Categories Relationship Table (Many-to-Many)
export const taskCategories = pgTable("task_categories", {
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "cascade" }),
});

// ✅ Defining Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  categories: many(categories),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  taskCategories: many(taskCategories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  taskCategories: many(taskCategories),
}));

export const taskCategoriesRelations = relations(taskCategories, ({ one }) => ({
  task: one(tasks, { fields: [taskCategories.taskId], references: [tasks.id] }),
  category: one(categories, { fields: [taskCategories.categoryId], references: [categories.id] }),
}));
