package com.bugbuster.servlets;

import java.sql.*;

public class DBUtil {
    private static final String DB_URL = "jdbc:sqlite:C:/sqlite/bugbuster.db"; // Update this

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public static void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            String createBugs = """
                        CREATE TABLE IF NOT EXISTS bugs (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            description TEXT,
                            status TEXT DEFAULT 'Open'
                        );
                    """;
            stmt.execute(createBugs);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
