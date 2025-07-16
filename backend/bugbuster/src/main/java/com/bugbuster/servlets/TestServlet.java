package com.bugbuster.servlets;

import com.bugbuster.utils.DBUtil;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/test")
public class TestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        DBUtil.initDatabase();
        String message = DBUtil.fetchMessage();

        res.setContentType("text/html");
        res.getWriter().println("Server is running..");
        res.getWriter().println("DB says: " + message);
    }
}
