package handlers

import (
	"context"

	"taskflow-backend/internal/db"

	"github.com/gin-gonic/gin"
)

// Create Task
func CreateTask(c *gin.Context) {
	projectID := c.Param("id")

	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Priority    string `json:"priority"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	query := `
		INSERT INTO tasks (title, description, priority, project_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id
	`

	var id string
	err := db.DB.QueryRow(context.Background(), query,
		input.Title,
		input.Description,
		input.Priority,
		projectID,
	).Scan(&id)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create task"})
		return
	}

	c.JSON(201, gin.H{
		"id":    id,
		"title": input.Title,
	})
}

// Get Tasks
func GetTasks(c *gin.Context) {
	projectID := c.Param("id")

	rows, err := db.DB.Query(context.Background(),
		"SELECT id, title, status FROM tasks WHERE project_id=$1",
		projectID,
	)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch tasks"})
		return
	}
	defer rows.Close()

	var tasks []gin.H

	for rows.Next() {
		var id, title, status string
		rows.Scan(&id, &title, &status)

		tasks = append(tasks, gin.H{
			"id":     id,
			"title":  title,
			"status": status,
		})
	}

	c.JSON(200, gin.H{"tasks": tasks})
}
