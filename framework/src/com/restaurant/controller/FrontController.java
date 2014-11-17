package com.restaurant.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.restaurant.bean.Member;
import com.restaurant.service.FrontService;
import com.restaurant.util.CacheLoader;
import com.restaurant.util.Common;
import com.restaurant.util.EmailUtil;
import com.restaurant.util.MD5Util;

@Controller
public class FrontController {
	@Resource
	private FrontService frontService;
	private final Log logger = LogFactory.getLog(FrontController.class);

	@RequestMapping(value = "index.jspx", method = { RequestMethod.GET })
	public ModelAndView gotoIndexPage(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		String storeId = "";
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equalsIgnoreCase("storeId")) {
					storeId = cookie.getValue();
				}
			}
		}
		List<Map<String, Object>> adList = frontService.getAdList();
		List<Map<String, Object>> hotList = frontService.getHotList(storeId);
		List<Map<String, Object>> newList = frontService.getNewList(storeId);
		List<Map<String, Object>> bestList = frontService.getBestList(storeId);
		List<Map<String, Object>> orderList = frontService
				.getOrderList(storeId);
		int count = frontService.getOrderCount(storeId);
		double made_time = frontService.getMadeTime(storeId);
		String pics = "";
		String links = "";
		String texts = "";
		Map<String, Object> long_ad = new HashMap<String, Object>();
		Map<String, Object> big_ad = new HashMap<String, Object>();
		Map<String, Object> scroll_ad = new HashMap<String, Object>();
		Map<String, Object> small_ad = new HashMap<String, Object>();
		for (Map<String, Object> ad : adList) {
			if (ad.get("location").equals("小图")) {
				small_ad = ad;
			} else if (ad.get("location").equals("长图")) {
				long_ad = ad;
			} else if (ad.get("location").equals("滚动")) {
				scroll_ad = ad;
			} else if (ad.get("location").equals("大图")) {
				pics += ad.get("pic") + "|";
				links += ad.get("url") + "|";
				texts += "|";
			}
		}
		big_ad.put("pics", pics.substring(0, pics.length() - 1));
		big_ad.put("links", links.substring(0, links.length() - 1));
		big_ad.put("texts", texts.substring(0, texts.length() - 1));
		ModelAndView mv = new ModelAndView("index");
		mv.addObject("long_ad", long_ad);
		mv.addObject("big_ad", big_ad);
		mv.addObject("small_ad", small_ad);
		mv.addObject("scroll_ad", scroll_ad);
		mv.addObject("hotList", hotList);
		mv.addObject("newList", newList);
		mv.addObject("bestList", bestList);
		mv.addObject("orderList", orderList);
		mv.addObject("count", count);
		mv.addObject("made_time", made_time);
		return mv;
	}

	@RequestMapping(value = "register.jspx", method = { RequestMethod.GET })
	public ModelAndView gotoRegisterPage(HttpServletRequest request) {
		String return_url = request.getHeader("referer");
		ModelAndView mv = new ModelAndView("register");
		if (return_url != null) {
			mv.addObject("return_url", return_url);
		}
		return mv;
	}

	@RequestMapping(value = "login.jspx", method = { RequestMethod.GET })
	public ModelAndView gotoLoginPage(HttpServletRequest request) {
		String return_url = request.getHeader("referer");
		System.out.println(return_url);
		ModelAndView mv = new ModelAndView("login");
		if (return_url != null) {
			mv.addObject("return_url", return_url);
		}
		return mv;
	}

	@RequestMapping(value = "user.do", method = { RequestMethod.GET })
	public ModelAndView gotoUserIndexPage(HttpServletRequest request) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			mv.setViewName("user");
			mv.addObject("curs", "index");
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", method = { RequestMethod.GET })
	public ModelAndView gotoUserIndexPage1(HttpServletRequest request) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			mv.setViewName("user");
			mv.addObject("curs", "index");
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=profile")
	public ModelAndView profile(HttpServletRequest request) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			mv.setViewName("profile");
			mv.addObject("curs", "profile");
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=order_list")
	public ModelAndView order_list(HttpServletRequest request) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			List<Map<String, Object>> order_list = frontService
					.getOrderList(member);
			mv.setViewName("order_list");
			mv.addObject("curs", "order_list");
			mv.addObject("order_list", order_list);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=order_detail")
	public ModelAndView order_detail(HttpServletRequest request,
			String order_number) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (Common.isNull(order_number)) {
			mv.setViewName("message");
			mv.addObject("msg", "查无此单");
			mv.addObject("result", false);
			return mv;
		}
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			List<Map<String, Object>> order_detail = frontService
					.getOrderDetail(member, order_number);
			mv.setViewName("order_detail");
			mv.addObject("curs", "profile");
			mv.addObject("order_detail", order_detail);
		}
		return mv;
	}
	
	@RequestMapping(value = "map.jspx")
	public ModelAndView map(HttpServletRequest request,
			String order_number) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (Common.isNull(order_number)) {
			mv.setViewName("404");
			return mv;
		}
		if (member == null) {
			mv.setViewName("404");
		} else {
			List<Map<String, Object>> deliverList = frontService
					.getOrderLocation(member, order_number);
			if(deliverList.size()!=1)
				mv.setViewName("404");
			else {
				mv.setViewName("map");
				mv.addObject("deliver", deliverList.get(0));
			}
		}
		return mv;
	}
	
	@RequestMapping(value = "ajax.jspx", params = "action=getOrderInfo")
	public void getOrderInfo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		Cookie[] cookies = request.getCookies();
		String storeId = "";
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equalsIgnoreCase("storeId")) {
					storeId = cookie.getValue();
				}
			}
		}
		List<Map<String, Object>> orderList = frontService
				.getOrderList(storeId);
		int count = frontService.getOrderCount(storeId);
		double made_time = frontService.getMadeTime(storeId);
		JSONObject result = new JSONObject();
		result.put("count", count);
		result.put("made_time", made_time);
		result.put("orderList", orderList);
		response.getWriter().print(result);
	}


	@RequestMapping(value = "user.jspx", params = "action=cancel_order")
	public ModelAndView cancel_order(HttpServletRequest request,
			String order_number) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			List<Map<String, Object>> order_list = frontService.getOrderDetail(
					member, order_number);
			if (order_list.size() > 0) {
				System.out.println(order_list.get(0).get("status"));
				if (order_list.get(0).get("status").toString().equals("1")) {
					if (frontService.cancel_order(member, order_number)) {
						String path = request.getContextPath();
						String basePath = request.getScheme() + "://"
								+ request.getServerName() + ":"
								+ request.getServerPort() + path + "/";
						mv.setViewName("message");
						mv.addObject("msg", "取消订单成功");
						mv.addObject("return_url", basePath
								+ "user.jspx?action=order_list");
						mv.addObject("result", true);
						return mv;
					}
				}
			}
			mv.setViewName("message");
			mv.addObject("msg", "取消订单失败，请查看是否该订单已经被确认");
			mv.addObject("result", false);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=address_list")
	public ModelAndView address_list(HttpServletRequest request) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
		} else {
			List<Map<String, Object>> address_list = frontService
					.getAddressList(member);
			mv.setViewName("address_list");
			mv.addObject("curs", "address_list");
			mv.addObject("address_list", address_list);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=act_edit_address")
	public ModelAndView act_edit_address(HttpServletRequest request,
			String address, String mobile, String address_id) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
			return mv;
		}
		mv.setViewName("message");
		if (Common.isNull(address)) {
			mv.addObject("result", false);
			mv.addObject("msg", "地址信息不能为空！");
			return mv;
		}
		if (Common.isNull(mobile)) {
			mv.addObject("result", false);
			mv.addObject("msg", "手机信息不能为空！");
			return mv;
		}
		if (frontService.editAddress(member, address_id, address, mobile)) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.addObject("result", true);
			mv.addObject("msg", "地址信息修改成功！");
			mv.addObject("return_url", basePath
					+ "user.jspx?action=address_list");
		} else {
			mv.addObject("result", false);
			mv.addObject("msg", "地址信息修改失败，请联系管理员！");
		}
		return mv;
	}
	
	@RequestMapping(value = "user.jspx", params = "action=drop_consignee")
	public ModelAndView drop_consignee(HttpServletRequest request,String id) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
			return mv;
		}
		mv.setViewName("message");
		if (Common.isNull(id)) {
			mv.addObject("result", false);
			mv.addObject("msg", "查无此地址，无法进行修改");
		}
		if (frontService.drop_consignee(member,id)) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.addObject("result", true);
			mv.addObject("msg", "地址信息删除成功！");
			mv.addObject("return_url", basePath
					+ "user.jspx?action=address_list");
		}else {
			mv.addObject("result", false);
			mv.addObject("msg", "地址信息删除失败，请联系管理员！");
		}
		return mv;
	}
	
	@RequestMapping(value = "user.jspx", params = "action=set_default")
	public ModelAndView set_default(HttpServletRequest request,String id) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
			return mv;
		}
		mv.setViewName("message");
		if (Common.isNull(id)) {
			mv.addObject("result", false);
			mv.addObject("msg", "查无此地址，无法进行设置");
		}
		if (frontService.set_default(member,id)) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.addObject("result", true);
			mv.addObject("msg", "设为默认地址成功！");
			mv.addObject("return_url", basePath
					+ "user.jspx?action=address_list");
		}else {
			mv.addObject("result", false);
			mv.addObject("msg", "设为默认地址失败，请联系管理员！");
		}
		return mv;
	}

	@RequestMapping(value = "user.do", params = "action=logout")
	public ModelAndView logout(HttpServletRequest request) {
		String return_url = request.getHeader("referer");
		ModelAndView mv = new ModelAndView("message");
		request.getSession().invalidate();
		if (return_url != null) {
			mv.addObject("return_url", return_url);
		}
		mv.addObject("msg", "您已成功注销!");
		mv.addObject("result", true);
		return mv;
	}

	@RequestMapping(value = "/user.do", params = "action=is_registered")
	public void is_registered(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String username = request.getParameter("username");
		String result = frontService.is_registered(username);
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/user.do", params = "action=check_email")
	public void check_email(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String email = request.getParameter("email");
		String result = frontService.check_email(email);
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/user.do", params = "action=act_register")
	public ModelAndView act_register(HttpServletRequest request,
			String username, String email, String password,
			String extend_field1, String extend_field2, String captcha,
			String return_url) throws ServletException, IOException {
		boolean result = false;
		String msg = "";
		String kaptchaExpected = (String) request.getSession().getAttribute(
				com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
		if (kaptchaExpected.equalsIgnoreCase(captcha)) {
			msg = frontService.act_register(username, email, password,
					extend_field1, extend_field2);
		} else {
			msg = "对不起，您输入的验证码不正确";
			result = false;
		}
		if (msg.equals("true")) {
			msg = "恭喜您已注册成功！请牢记您的用户名" + username + ",并请您尽快到个人中心完善您的个人资料。";
			Member member = frontService.findMemberByUsername(username);
			HttpSession session = request.getSession();
			session.setAttribute("member", member);
			result = true;
		} else {
			result = false;
		}
		ModelAndView mv = new ModelAndView("message");
		mv.addObject("msg", msg);
		mv.addObject("return_url", return_url);
		mv.addObject("result", result);
		return mv;
	}

	@RequestMapping(value = "/user.do", params = "action=act_login")
	public ModelAndView act_login(HttpServletRequest request, String username,
			String password, String captcha, String return_url)
			throws ServletException, IOException {
		boolean result = true;
		String msg = "";
		String kaptchaExpected = (String) request.getSession().getAttribute(
				com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
		if (kaptchaExpected.equalsIgnoreCase(captcha)) {
			Member member = frontService.findMemberByUsername(username);
			if (member == null) {
				msg = "对不起，该用户不存在";
				result = false;
			} else if (!member.getPassword().equals(password)) {
				msg = "对不起，您输入的密码不正确";
				result = false;
			} else {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				member.setLast_login_time(sdf.format(new Date()));
				frontService.update(member);
				msg = "登陆成功";
				HttpSession session = request.getSession();
				session.setAttribute("member", member);
			}
		} else {
			msg = "对不起，您输入的验证码不正确";
			result = false;
		}
		ModelAndView mv = new ModelAndView("message");
		mv.addObject("msg", msg);
		mv.addObject("return_url", return_url);
		mv.addObject("result", result);
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_q")
	public ModelAndView get_pwd_q(HttpServletRequest request) {
		ModelAndView mv = new ModelAndView("get_pwd_q");
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_q_step1")
	public ModelAndView get_pwd_q_step1(HttpServletRequest request,
			String username) {
		Member member = frontService.findMemberByUsername(username);
		ModelAndView mv = new ModelAndView("");
		if (member != null && member.getQuestion() != null
				&& !member.getQuestion().equals("")) {
			mv.setViewName("get_pwd_q_step1");
			mv.addObject("question", member.getQuestion());
			request.getSession().setAttribute("username", username);
		} else {
			mv.setViewName("message");
			mv.addObject("msg", "您没有设置密码提示问题，无法通过这种方式找回密码。");
			mv.addObject("result", false);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_q_step2")
	public ModelAndView get_pwd_q_step2(HttpServletRequest request,
			String question, String answer) {
		String username = (String) request.getSession()
				.getAttribute("username");
		Member member = frontService.findMemberByUsername(username);
		ModelAndView mv = new ModelAndView("");
		if (member != null && member.getQuestion() != null
				&& !member.getQuestion().equals("")
				&& member.getQuestion().equals(question)
				&& member.getAnswer() != null && !member.getAnswer().equals("")
				&& member.getAnswer().equals(answer)) {
			request.getSession().setAttribute("oldpwd", member.getPassword());
			mv.setViewName("get_pwd_step2");
		} else {
			mv.setViewName("message");
			mv.addObject("msg", "您输入的密码答案是错误的。");
			mv.addObject("result", false);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=changePwd")
	public ModelAndView changePwd(HttpServletRequest request,
			String new_password) {
		String username = (String) request.getSession()
				.getAttribute("username");
		String oldPwd = (String) request.getSession().getAttribute("oldpwd");
		Member member = frontService.findMemberByUsername(username);
		ModelAndView mv = new ModelAndView("message");
		if (member != null && member.getPassword().equals(oldPwd)) {
			member.setPassword(new_password);
			member.setCode("");
			member.setOutTime("");
			boolean result = frontService.update(member);
			if (result) {
				String path = request.getContextPath();
				String basePath = request.getScheme() + "://"
						+ request.getServerName() + ":"
						+ request.getServerPort() + path + "/";
				mv.addObject("msg", "您已成功修改密码，请通过新密码登陆。");
				mv.addObject("return_url", basePath + "index.jspx");
				mv.addObject("result", true);
				request.getSession().removeAttribute("username");
				request.getSession().removeAttribute("oldpwd");
			} else {
				mv.addObject("msg", "修改密码出现系统错误，请联系管理员解决。");
				mv.addObject("result", false);
			}
		} else {
			mv.addObject("msg", "原始密码错误");
			mv.addObject("result", false);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_e")
	public ModelAndView get_pwd_e(HttpServletRequest request) {
		ModelAndView mv = new ModelAndView("get_pwd_e");
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_e_step1")
	public ModelAndView get_pwd_e_step1(HttpServletRequest request,
			String user_name, String email) {
		Member member = frontService.findMemberByUsername(user_name);
		ModelAndView mv = new ModelAndView("message");
		if (member != null && member.getEmail() != null
				&& !member.getEmail().equals("")
				&& member.getEmail().equals(email)) {
			try {
				String secretKey = UUID.randomUUID().toString(); // 密钥
				Timestamp outDate = new Timestamp(
						System.currentTimeMillis() + 30 * 60 * 1000);// 30分钟后过期
				String key = user_name + "$" + outDate.getTime() + "$"
						+ secretKey;
				String digitalSignature = MD5Util.MD5(key).toUpperCase(); // 数字签名
				member.setCode(digitalSignature);
				member.setOutTime(Long.toString(outDate.getTime()));
				frontService.update(member);
				String emailTitle = CacheLoader.getCache().get("siteName")
						+ "密码找回";
				String path = request.getContextPath();
				String basePath = request.getScheme() + "://"
						+ request.getServerName() + ":"
						+ request.getServerPort() + path + "/";
				String resetPassHref = basePath
						+ "user.jspx?action=get_pwd_e_step2&sid="
						+ digitalSignature + "&userName="
						+ member.getUsername();
				String emailContent = "请勿回复本邮件.点击下面的链接,重设密码<br/><a href="
						+ resetPassHref + " target='_BLANK'>点击我重新设置密码</a>"
						+ "<br/>tips:本邮件超过30分钟,链接将会失效，需要重新申请'找回密码'";
				System.out.print(resetPassHref);
				EmailUtil.getInstance().sendHtmlEmail(emailTitle, emailContent,
						member.getEmail());
				mv.addObject("msg", "已成功发送邮件，请到邮箱中查看！");
				mv.addObject("return_url", basePath + "user.jspx");
				mv.addObject("result", true);
			} catch (Exception e) {
				logger.debug(e.getStackTrace());
				logger.error(e.getMessage());
				mv.addObject("msg", "系统错误，未能成功发送邮件，请联系管理员！");
				mv.addObject("result", false);
			}
		} else {
			mv.addObject("msg", "您填写的用户名与电子邮件地址不匹配，请重新输入！");
			mv.addObject("result", false);
		}
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=get_pwd_e_step2")
	public ModelAndView get_pwd_e_step2(HttpServletRequest request, String sid,
			String userName) {
		ModelAndView mv = new ModelAndView("");
		if (sid == null || userName == null || sid.equals("")
				|| userName.equals("")) {
			mv.setViewName("message");
			mv.addObject("msg", "链接不完整,请重新生成");
			mv.addObject("result", false);
			return mv;
		}
		Member member = frontService.findMemberByUsername(userName);
		if (member == null) {
			mv.setViewName("message");
			mv.addObject("msg", "链接错误,无法找到匹配用户,请重新申请找回密码.");
			mv.addObject("result", false);
			return mv;
		}
		long outDate = Long.parseLong((member.getOutTime() == null || member
				.getOutTime().equals("")) ? "0" : member.getOutTime());
		if (outDate <= System.currentTimeMillis()) { // 表示已经过期
			mv.setViewName("message");
			mv.addObject("msg", "链接已经过期,请重新申请找回密码.");
			mv.addObject("result", false);
			return mv;
		}
		String code = member.getCode(); // 数字签名
		if (!code.equals(sid)) {
			mv.setViewName("message");
			mv.addObject("msg", "链接不正确,是否已经过期了?重新申请吧");
			mv.addObject("result", false);
			return mv;
		}
		mv.setViewName("get_pwd_step2"); // 返回到修改密码的界面
		request.getSession().setAttribute("username", userName);
		request.getSession().setAttribute("oldpwd", member.getPassword());
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=act_edit_profile")
	public ModelAndView act_edit_profile(HttpServletRequest request,
			String email, String extend_field7, String sel_question,
			String passwd_answer) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
			return mv;
		}
		mv.setViewName("message");
		if (Common.isNull(email)) {
			mv.addObject("result", false);
			mv.addObject("msg", "邮箱不能为空");
			return mv;
		}
		if (Common.isNull(extend_field7)) {
			mv.addObject("result", false);
			mv.addObject("msg", "手机不能为空");
			return mv;
		}
		if (Common.isNull(sel_question) || Common.isNull(passwd_answer)) {
			mv.addObject("result", false);
			mv.addObject("msg", "密码保护问题及答案不能为空");
			return mv;
		}
		if (!email
				.matches("^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$")) {
			mv.addObject("result", false);
			mv.addObject("msg", "邮箱格式不正确");
			return mv;
		}
		member.setEmail(email);
		member.setPhone(extend_field7);
		member.setQuestion(sel_question);
		member.setAnswer(passwd_answer);
		if (frontService.update(member)) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.addObject("result", true);
			mv.addObject("msg", "个人资料修改成功");
			mv.addObject("return_url", basePath + "user.jspx?action=profile");
			return mv;
		}
		mv.addObject("result", false);
		mv.addObject("msg", "系统异常，修改失败，请联系管理员");
		return mv;
	}

	@RequestMapping(value = "user.jspx", params = "action=act_edit_password")
	public ModelAndView act_edit_password(HttpServletRequest request,
			String old_password, String new_password, String comfirm_password) {
		Member member = (Member) request.getSession().getAttribute("member");
		ModelAndView mv = new ModelAndView();
		if (member == null) {
			mv.setView(new RedirectView("login.jspx"));
			return mv;
		}
		mv.setViewName("message");
		if (Common.isNull(old_password)) {
			mv.addObject("result", false);
			mv.addObject("msg", "原始密码不能为空");
			return mv;
		}
		if (Common.isNull(new_password)) {
			mv.addObject("result", false);
			mv.addObject("msg", "新密码不能为空");
			return mv;
		}
		if (!new_password.equals(comfirm_password)) {
			mv.addObject("result", false);
			mv.addObject("msg", "两次输入的密码不一致！");
			return mv;
		}
		member = frontService.findMemberByUsername(member.getUsername());
		if (!old_password.equals(member.getPassword())) {
			mv.addObject("result", false);
			mv.addObject("msg", "原始密码错误");
			return mv;
		}
		member.setPassword(new_password);
		if (frontService.update(member)) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.addObject("result", true);
			mv.addObject("msg", "密码修改成功，请通过新密码登陆");
			mv.addObject("return_url", basePath + "user.jspx?action=profile");
			request.getSession().removeAttribute("member");
			return mv;
		}
		mv.addObject("result", false);
		mv.addObject("msg", "系统异常，修改失败，请联系管理员");
		return mv;
	}

	@RequestMapping(value = "article_cat.jspx")
	public ModelAndView article_cat(HttpServletRequest request,String id) {
		ModelAndView mv = new ModelAndView();
		if(Common.isNull(id)) {
			mv.setViewName("message");
			mv.addObject("msg", "对不起该文章类别不存在！");
			mv.addObject("result", false);
			return mv;
		}
		Map<String, Object> cat = frontService.getArticleCat(id);
		if(cat == null) {
			mv.setViewName("message");
			mv.addObject("msg", "对不起该文章类别不存在！");
			mv.addObject("result", false);
			return mv;
		}
		List<Map<String, Object>> articleList = frontService.getArticleList(id);
		mv.setViewName("article_cat");
		mv.addObject("cat", cat);
		mv.addObject("articleList", articleList);
		return mv;
	}
	
	@RequestMapping(value = "article.jspx")
	public ModelAndView article(HttpServletRequest request,String id) {
		ModelAndView mv = new ModelAndView();
		if(Common.isNull(id)) {
			mv.setViewName("message");
			mv.addObject("msg", "对不起该文章不存在！");
			mv.addObject("result", false);
			return mv;
		}
		Map<String, Object> article = frontService.getArticle(id);
		if(article == null) {
			mv.setViewName("message");
			mv.addObject("msg", "对不起该文章不存在！");
			mv.addObject("result", false);
			return mv;
		}
		mv.setViewName("article");
		mv.addObject("article", article);
		return mv;
	}
	
	@RequestMapping(value = "faq.jspx")
	public ModelAndView faq(HttpServletRequest request,String id) {
		ModelAndView mv = new ModelAndView("faq");
		List<Map<String, Object>> topicList = frontService.getListBySql("select * from faq_topic where del_flag = 1");
		List<Map<String, Object>> faqList = frontService.getListBySql("select * from faq where del_flag = 1");
		mv.addObject("topicList", topicList);
		mv.addObject("faqList", faqList);
		return mv;
	}
	
}
