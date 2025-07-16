package com.bugbuster.utils;

import java.io.File;
import java.sql.*;

public class DBUtil {
    private static final String DB_DIR = System.getProperty("user.home") + "/bugbuster/data";
    private static final String DB_PATH = DB_DIR + "/bugbuster.db";
    private static final String DB_URL = "jdbc:sqlite:" + DB_PATH;

    public static void initDatabase() {
        try {
            // Load SQLite JDBC driver
            Class.forName("org.sqlite.JDBC");

            // Ensure data directory exists
            File dbDir = new File(DB_DIR);
            if (!dbDir.exists()) {
                if (dbDir.mkdirs()) {
                    System.out.println("✅ Created directory: " + DB_DIR);
                } else {
                    System.err.println("❌ Failed to create directory: " + DB_DIR);
                }
            }

            System.out.println("🛠 DB path: " + DB_PATH);

            // Connect to the database
            try (Connection conn = DriverManager.getConnection(DB_URL)) {
                if (conn != null) {
                    System.out.println("✅ SQLite connected");

                    String createTableSQL = """
                                CREATE TABLE IF NOT EXISTS test_table (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    message TEXT NOT NULL
                                );
                            """;

                    try (Statement stmt = conn.createStatement()) {
                        stmt.execute(createTableSQL);

                        // Only insert sample message if table is empty
                        ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM test_table");
                        if (rs.next() && rs.getInt(1) == 0) {
                            stmt.executeUpdate(
                                    "INSERT INTO test_table (message) VALUES ('Hello from SQLite in data folder')");
                            System.out.println("✅ Sample data inserted.");
                        } else {
                            System.out.println("ℹ️ Sample data already exists.");
                        }
                    }
                }
            }

        } catch (ClassNotFoundException e) {
            System.err.println("❌ SQLite JDBC driver not found.");
            e.printStackTrace();
        } catch (SQLException e) {
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
}
