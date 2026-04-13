import { useState } from "react";
import API from "./api";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  const theme = {
    bg: isDarkMode ? "#0b0e14" : "#faf9f6",
    cardBg: isDarkMode ? "#161b22" : "#ffffff",
    sectionBg: isDarkMode ? "#1f242c" : "#f3f4f6",
    text: isDarkMode ? "#e6edf3" : "#1a1a1a",
    textMuted: isDarkMode ? "#7d8590" : "#6b7280",
    border: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
    accent: "#6366f1", 
    accentSecondary: "#ec4899",
  };

  // --- Logic Paths ---
  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      setToken(res.data.token);
      alert("Glad to see you again!");
    } catch (err) { alert("Hmm, that login didn't quite work."); }
  };

  const createProject = async () => {
  try {
    await API.post(
      "/projects/",
      { name: projectName, description: "demo" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getProjects();
  } catch (err) {
    alert("Couldn't start that project just yet.");
  }
};

  const getProjects = async () => {
  try {
    const res = await API.get("/projects/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setProjects(res.data.projects);
  } catch (err) {
    alert("Error fetching projects");
  }
};
  const createTask = async () => {
  try {
    await API.post(`/projects/${projectId}/tasks`, {
      title: taskTitle,
      description: "demo",
      priority: "medium"
    });

    alert("Task created");
    getTasks(); // refresh
  } catch (err) {
    alert("Error creating task");
  }
};

  const getTasks = async () => {
    try {
      const res = await API.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.tasks);
    } catch (err) { alert("Couldn't pull those tasks up."); }
  };


  const styles = {
    container: {
      minHeight: "100vh",
      background: theme.bg,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      padding: "20px 20px 100px 20px",
      transition: "background 0.5s ease",
      position: "relative",
      overflow: "hidden",
    },
    mesh: {
      position: "absolute",
      width: "600px",
      height: "600px",
      background: `radial-gradient(circle, ${theme.accent}22 0%, transparent 70%)`,
      top: "-100px",
      right: "-100px",
      zIndex: 0,
    },
    card: {
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      padding: "48px 40px",
      borderRadius: "32px",
      width: "100%",
      maxWidth: "440px",
      color: theme.text,
      boxShadow: isDarkMode 
        ? "0 30px 60px -12px rgba(0, 0, 0, 0.5)" 
        : "0 20px 40px -10px rgba(0, 0, 0, 0.05)",
      position: "relative",
      zIndex: 1,
    },
    toggleBtn: {
      position: "absolute",
      top: "30px",
      right: "30px",
      background: "transparent",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      opacity: 0.7,
    },
    section: {
      marginBottom: "32px",
      padding: "24px",
      background: theme.sectionBg,
      borderRadius: "24px",
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      margin: "10px 0",
      borderRadius: "14px",
      border: "1px solid transparent",
      background: isDarkMode ? "#0d1117" : "#ffffff",
      color: theme.text,
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "14px",
      marginTop: "12px",
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
      color: "white",
      fontWeight: "700",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
    },
    // --- RIGHT ALIGNED DOCK ---
    dock: {
      position: "fixed",
      bottom: "40px",
      right: "40px", // Aligned to the right
      background: isDarkMode ? "rgba(22, 27, 34, 0.8)" : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(20px)",
      padding: "8px 12px",
      borderRadius: "24px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      border: `1px solid ${theme.border}`,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      zIndex: 1000,
    },
    dockItem: (id) => ({
      padding: "10px 16px",
      borderRadius: "18px",
      background: hovered === id ? theme.sectionBg : "transparent",
      color: hovered === id ? theme.accent : theme.text,
      textDecoration: "none",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.2s ease",
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.mesh}></div>
      
      <div style={styles.card}>
        <button 
          style={styles.toggleBtn} 
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>

        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "900", letterSpacing: "-1.5px" }}>
            Task<span style={{ color: theme.accent }}>Flow.</span>
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "15px", marginTop: "6px" }}>
            Ready to get some work done?
          </p>
        </header>

        {/* AUTH */}
        {!token && (
          <div style={styles.section}>
            <p style={{ margin: "0 0 15px 0", fontSize: "14px", fontWeight: "600" }}>Let's get you in</p>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <button onClick={login} style={styles.button}>Take me in →</button>
          </div>
        )}

        {/* PROJECTS */}
        <div style={styles.section}>
          <p style={{ margin: "0 0 15px 0", fontSize: "14px", fontWeight: "600" }}>Workspace</p>
          <input placeholder="Project Name" onChange={(e) => setProjectName(e.target.value)} style={styles.input} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={createProject} style={styles.button}>Create</button>
            <button 
               onClick={getProjects} 
               style={{ ...styles.button, background: "transparent", color: theme.text, border: `1px solid ${theme.border}`, boxShadow: "none" }}
            >
              Reload
            </button>
          </div>
          <div style={{ marginTop: "15px", maxHeight: "120px", overflowY: "auto" }}>
  {projects.map((p) => (
    <div key={p.id} style={{ padding: "8px", fontSize: "13px" }}>
      {p.name}
      <div style={{ fontSize: "10px", color: theme.textMuted }}>
        {p.id}
      </div>
    </div>
  ))}
</div>
        </div>

        {/* TASKS */}
<div style={{ ...styles.section, marginBottom: 0 }}>
  <p style={{ margin: "0 0 15px 0", fontSize: "14px", fontWeight: "600" }}>
  Deep Dive
</p>

<input
  placeholder="Enter Project ID"
  onChange={(e) => setProjectId(e.target.value)}
  style={styles.input}
/>

<input
  placeholder="Task - Assigned To - Due Date"
  onChange={(e) => setTaskTitle(e.target.value)}
  style={styles.input}
/>

<div style={{ display: "flex", gap: "10px" }}>
  <button 
    onClick={createTask} 
    style={styles.button}
  >
    Add Task
  </button>

  <button 
    onClick={getTasks} 
    style={{ ...styles.button, background: theme.text, color: theme.cardBg }}
  >
    Show tasks
  </button>
</div>

{/* tasks list */}
<div style={{ marginTop: "15px" }}>
  {(tasks || []).map((t) => (
    <div key={t.id} style={{ padding: "8px", fontSize: "13px" }}>
      {t.title}
      <span style={{ float: "right", color: theme.accent }}>
        {t.status}
      </span>
    </div>
  ))}
</div>

</div>
      </div>

      {/* RIGHT ALIGNED DOCK */}
      <nav style={styles.dock}>
        <div style={{ padding: "0 12px", color: theme.textMuted, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
          Tanishq
        </div>
        
        <a 
          href="https://www.linkedin.com/in/tanishq-chaurasia-baaa821b1/" 
          target="_blank" rel="noreferrer" 
          style={styles.dockItem('li')}
          onMouseEnter={() => setHovered('li')}
          onMouseLeave={() => setHovered(null)}
        >
          LinkedIn
        </a>
        
        <a 
          href="mailto:tanishq.ch0705@gmail.com" 
          style={styles.dockItem('em')}
          onMouseEnter={() => setHovered('em')}
          onMouseLeave={() => setHovered(null)}
        >
          Email
        </a>
        
        <a 
          href="https://github.com/TanishqCh07" 
          target="_blank" rel="noreferrer" 
          style={styles.dockItem('gh')}
          onMouseEnter={() => setHovered('gh')}
          onMouseLeave={() => setHovered(null)}
        >
          GitHub
        </a>
      </nav>
    </div>
  );
}

export default App;