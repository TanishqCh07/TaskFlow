package handlers

import (
	"context"

	"taskflow-backend/internal/db"

	"github.com/gin-gonic/gin"
)

// Create Project
func CreateProject(c *gin.Context) {
	var input struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "invalid input"})
		return
	}

	// TEMP: hardcoded user_id (we’ll improve later if time)
	query := `
		INSERT INTO projects (name, description, user_id)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	var id string
	err := db.DB.QueryRow(context.Background(), query, input.Name, input.Description, "e80f9c0e-b638-45c5-8d9b-2c7aed427d4e").Scan(&id)

	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create project"})
		return
	}

	c.JSON(201, gin.H{
		"id":   id,
		"name": input.Name,
	})
}

// Get Projects
func GetProjects(c *gin.Context) {
	rows, err := db.DB.Query(context.Background(), "SELECT id, name FROM projects")
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to fetch projects"})
		return
	}
	defer rows.Close()

	var projects []gin.H

	for rows.Next() {
		var id, name string
		rows.Scan(&id, &name)

		projects = append(projects, gin.H{
			"id":   id,
			"name": name,
		})
	}

	c.JSON(200, gin.H{"projects": projects})
}
