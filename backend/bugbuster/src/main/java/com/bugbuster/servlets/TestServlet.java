package com.bugbuster.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/test")
public class TestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        DBUtil.initDatabase();
        res.setContentType("text/html");
        res.getWriter().println("Servlet Working from VS Code!");
    }
}
