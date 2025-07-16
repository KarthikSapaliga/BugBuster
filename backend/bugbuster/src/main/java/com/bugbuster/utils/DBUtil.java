package com.bugbuster.utils;

import java.io.File;
import java.sql.*;

public class DBUtil {
    private static final String DB_DIR = System.getProperty("user.home") + "/bugbuster/data";
    private static final String DB_PATH = DB_DIR + "/bugbuster.db";
    private static final String DB_URL = "jdbc:sqlite:" + DB_PATH;

    public static void initDatabase() {
        try {
            Class.forName("org.sqlite.JDBC");

            File dbDir = new File(DB_DIR);
            if (!dbDir.exists()) {
                dbDir.mkdirs();
                System.out.println("✅ Created directory: " + DB_DIR);
            }

            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                if (conn != null) {
                    System.out.println("✅ SQLite connected");

                    Statement stmt = conn.createStatement();

                    // Create tables
                    String[] schemaStatements = new String[] {
                            """
                                    CREATE TABLE IF NOT EXISTS user (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        first_name TEXT,
                                        last_name TEXT,
                                        email TEXT UNIQUE NOT NULL,
                                        role TEXT CHECK(role IN ('ProjectManager', 'Developer', 'Tester')),
                                        is_email_verified BOOLEAN DEFAULT FALSE,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS project (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name TEXT NOT NULL UNIQUE,
                                        description TEXT,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS bug (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        title TEXT NOT NULL,
                                        description TEXT,
                                        severity TEXT CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')),
                                        urgency TEXT CHECK(urgency IN ('Low', 'Medium', 'High')),
                                        priority TEXT NOT NULL,
                                        status TEXT CHECK(status IN ('Open', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
                                        reported_by INTEGER NOT NULL,
                                        updated_by INTEGER,
                                        assigned_to INTEGER,
                                        project_id INTEGER NOT NULL,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        resolved_at DATETIME,
                                        FOREIGN KEY (updated_by) REFERENCES user(id) ON DELETE SET NULL,
                                        FOREIGN KEY (reported_by) REFERENCES user(id) ON DELETE SET NULL,
                                        FOREIGN KEY (assigned_to) REFERENCES user(id) ON DELETE SET NULL,
                                        FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS bug_details (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        bug_id INTEGER NOT NULL,
                                        expected_outcome TEXT,
                                        actual_outcome TEXT,
                                        steps_to_reproduce TEXT,
                                        log TEXT,
                                        FOREIGN KEY (bug_id) REFERENCES bug(id) ON DELETE CASCADE
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS bug_attachments (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        bug_id INTEGER NOT NULL,
                                        file_name TEXT NOT NULL,
                                        file_url TEXT NOT NULL,
                                        FOREIGN KEY (bug_id) REFERENCES bug(id) ON DELETE CASCADE
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS external_issue (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        bug_id INTEGER,
                                        vcs_type TEXT NOT NULL,
                                        vcs_issue_id TEXT NOT NULL,
                                        repo TEXT NOT NULL,
                                        title TEXT,
                                        body TEXT,
                                        state TEXT CHECK(state IN ('open', 'closed')),
                                        created_at DATETIME,
                                        updated_at DATETIME,
                                        FOREIGN KEY (bug_id) REFERENCES bug(id) ON DELETE SET NULL
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS external_pr (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        bug_id INTEGER,
                                        vcs_type TEXT NOT NULL,
                                        vcs_pr_id TEXT NOT NULL,
                                        repo TEXT NOT NULL,
                                        title TEXT,
                                        author TEXT,
                                        state TEXT CHECK(state IN ('open', 'merged', 'closed')),
                                        created_at DATETIME,
                                        updated_at DATETIME,
                                        FOREIGN KEY (bug_id) REFERENCES bug(id) ON DELETE SET NULL
                                    );
                                    """,
                            """
                                    CREATE TABLE IF NOT EXISTS project_team (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        project_id INTEGER NOT NULL,
                                        user_id INTEGER NOT NULL,
                                        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE,
                                        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                                        UNIQUE(project_id, user_id)
                                    );
                                    """
                    };

                    for (String sql : schemaStatements) {
                        stmt.execute(sql);
                    }

                    System.out.println("✅ All tables created successfully.");
                }
            }

        } catch (Exception e) {
            System.err.println("❌ DB Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static String fetchMessage() {
        try (Connection conn = DriverManager.getConnection(DB_URL)) {
            String query = "SELECT message FROM test_table ORDER BY id DESC LIMIT 1";
            try (Statement stmt = conn.createStatement();
                    ResultSet rs = stmt.executeQuery(query)) {

                if (rs.next()) {
                    return rs.getString("message");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "⚠️ No message found.";
    }

    public static void listTables() {
        try (Connection conn = DriverManager.getConnection(DB_URL);
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(
                        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")) {

            System.out.println("📋 Available Tables in the Database:");
            while (rs.next()) {
                System.out.println(" - " + rs.getString("name"));
            }

        } catch (SQLException e) {
            System.err.println("❌ Error fetching table list: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
