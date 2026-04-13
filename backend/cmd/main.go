package main

import (
	"log"
	"taskflow-backend/internal/db"
	"taskflow-backend/internal/handlers"
	"taskflow-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	db.InitDB()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	r.POST("/auth/register", handlers.Register)
	r.POST("/auth/login", handlers.Login)
	r.POST("/projects/:id/tasks", handlers.CreateTask)
	r.GET("/projects/:id/tasks", handlers.GetTasks)

	protectedAPI := r.Group("/api")
	protectedAPI.Use(middleware.AuthMiddleware())

	protectedAPI.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "protected route working"})
	})

	protectedProjects := r.Group("/projects")
	protectedProjects.Use(middleware.AuthMiddleware())

	protectedProjects.POST("/", handlers.CreateProject)
	protectedProjects.GET("/", handlers.GetProjects)

	log.Println("Server running on port 8080")
	r.Run(":8080")
}
