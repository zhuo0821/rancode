package com.restaurant.controller;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import com.restaurant.bean.User;

public class LogoutController extends AbstractController {

	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("userInfo");
		request.getSession().invalidate();
		try {
			response.getWriter().print("{success:true}");
			System.out.println(new Date() + "---------" +user.getLoginName() + "LogOut");
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}