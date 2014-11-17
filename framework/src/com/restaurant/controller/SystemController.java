package com.restaurant.controller;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.directwebremoting.ScriptSession;
import org.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.restaurant.bean.User;
import com.restaurant.dwr.DWRScriptSessionListener;
import com.restaurant.service.SystemService;
import com.restaurant.util.EncodeUtil;
import com.restaurant.util.ExpUtil;

@Controller
public class SystemController {
	@Resource
	private SystemService systemService;
	private final Log logger = LogFactory.getLog(SystemController.class);

	@RequestMapping(value = "admin.jspx", method = { RequestMethod.GET })
	public ModelAndView getFirstPage(HttpServletRequest request) {
		
		ModelAndView mv = new ModelAndView("admin");
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("userInfo");
		if (user != null) {
			String path = request.getContextPath();
			String basePath = request.getScheme() + "://"
					+ request.getServerName() + ":" + request.getServerPort()
					+ path + "/";
			mv.setView(new RedirectView(basePath + "manage.jspx"));
		}
		return mv;
	}

	@RequestMapping(value = "manage.jspx", method = { RequestMethod.GET })
	public ModelAndView manage(HttpServletRequest request) {
		HttpSession session = request.getSession();
		ScriptSession scriptSession =  DWRScriptSessionListener.scriptSessionMap.get(session.getId());
		ModelAndView mv = new ModelAndView("manage");
		if(scriptSession!=null){
			mv.setViewName("repeat_login");
		}
		return mv;
	}
	
	@RequestMapping(value = "mobile.jspx", method = { RequestMethod.GET })
	public ModelAndView mobile(HttpServletRequest request) {
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("userInfo");
		ModelAndView mv = new ModelAndView("mobile");
		if(!user.getRoleId().equals("2")){
			mv.setViewName("manage");
		}
		return mv;
	}

	@RequestMapping(value = "/system.do", params = "action=getMenu")
	public void getMenu(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String id = request.getParameter("id");
		String role = request.getParameter("role");
		String filter = request.getParameter("filter");
		net.sf.json.JSONArray filters = null;
		if (filter != null && !filter.equals(""))
			filters = net.sf.json.JSONArray.fromObject(filter);
		JSONArray jsonArray = systemService.getMenu(id, role, filters);
		response.getWriter().print(jsonArray);
	}

	@RequestMapping(value = "/system.do", params = "action=query")
	public void query(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		request.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		int limit = -1;
		int start = 0;
		if (request.getParameter("limit") != null) {
			limit = Integer.parseInt(request.getParameter("limit"));
		}
		if (request.getParameter("start") != null) {
			start = Integer.parseInt(request.getParameter("start"));
		}
		String sort = request.getParameter("sort");
		Map<String, Object> config = systemService.getConfig(funcId);
		String fields = (String) config.get("FIELDS");
		String table = (String) config.get("TABLE");
		String columns = (String) config.get("COLUMNS");
		String[] field = {};
		if (fields != null && !fields.equals("")) {
			field = fields.split(",");
		}
		String relations = (String) config.get("RELATIONS");
		StringBuffer sql = new StringBuffer("SELECT " + columns + " FROM "
				+ table + " WHERE 1=1 ");
		for (int i = 0; i < field.length; i++) {
			String temp = field[i];
			String param = request.getParameter(temp);
			if (param != null && !param.equals(""))
				param = new String(param.trim().getBytes("ISO-8859-1"), "UTF-8");
			if (param != null && !param.equals("")) {
				sql.append(" AND " + temp + " = '" + param + "'");
			}
		}
		if (relations != null && !relations.equals("")) {
			sql.append(" AND " + relations);
		}
		if (sort != null && !sort.equals("")) {
			net.sf.json.JSONArray sortJsonArray = net.sf.json.JSONArray
					.fromObject(sort);
			JSONObject sortJsonObject = sortJsonArray.getJSONObject(0);
			String property = sortJsonObject.getString("property");
			String[] column = columns.split(",");
			int index = -1;
			for (int i = 0; i < column.length; i++) {
				index = column[i].indexOf(" " + property);
				if (index > 0) {
					property = column[i].substring(0, index + 1);
					break;
				}
			}
			if (index < 0) {
				for (int i = 0; i < column.length; i++) {
					index = column[i].indexOf(".*");
					if (index > 0) {
						property = column[i].substring(0, index) + "."
								+ property;
						break;
					}
				}
				for (int i = 0; i < column.length; i++) {
					index = column[i].indexOf("." + property);
					if (index > 0) {
						property = column[i].substring(0, index) + "."
								+ property;
						break;
					}
				}
			}
			sql.append(" ORDER BY " + property + " "
					+ sortJsonObject.getString("direction"));
		}
		System.out.println(sql.toString());
		String result = systemService.getResult(sql, limit, start);
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=insert")
	public void insert(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		Map<String, Object> config = systemService.getConfig(funcId);
		String fields = (String) config.get("FIELDS");
		String table = (String) config.get("TABLE");
		String columns = (String) config.get("COLUMNS");
		String[] field = fields.split(",");
		StringBuffer sql = new StringBuffer("INSERT INTO " + table + " ("
				+ columns + ")" + " VALUES (");
		for (int i = 0; i < field.length; i++) {
			String temp = field[i];
			String param = (String) request.getParameter(temp);
			if (param == null || param.equals("")) {
				if (i != field.length - 1) {
					sql.append(null + ",");
				} else {
					sql.append(null + ")");
				}
			} else {
				if (i != field.length - 1) {
					sql.append("'" + param + "',");
				} else {
					sql.append("'" + param + "')");
				}
			}
		}
		String flag = systemService.executeSql(sql);
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=update")
	public void update(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		Map<String, Object> config = systemService.getConfig(funcId);
		String fields = (String) config.get("FIELDS");
		String table = (String) config.get("TABLE");
		String columns = (String) config.get("COLUMNS");
		String[] field = fields.split(",");
		String[] column = columns.split(",");
		StringBuffer sql = new StringBuffer("UPDATE " + table + " SET ");
		for (int i = 0; i < field.length; i++) {
			String temp = field[i];
			String param = (String) request.getParameter(temp);
			if (param == null)
				param = "";
			if (i != field.length - 1) {
				sql.append(temp + " = '" + param + "',");
			} else {
				sql.append(temp + " = '" + param + "' WHERE 1=1 ");
			}
		}
		for (int i = 0; i < column.length; i++) {
			String temp = column[i];
			String param = (String) request.getParameter(temp);
			sql.append(" AND " + temp + " = '" + param + "'");

		}
		String flag = systemService.executeSql(sql);
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=replace")
	public void replace(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		Map<String, Object> config = systemService.getConfig(funcId);
		String fields = (String) config.get("FIELDS");
		String table = (String) config.get("TABLE");
		String columns = (String) config.get("COLUMNS");
		String[] field = fields.split(",");
		StringBuffer sql = new StringBuffer("REPLACE INTO " + table + " ("
				+ columns + ")" + " VALUES (");
		for (int i = 0; i < field.length; i++) {
			String temp = field[i];
			String param = (String) request.getParameter(temp);
			if (param != null && param.equals(""))
				param = null;
			if (param == null) {
				if (i != field.length - 1) {
					sql.append(param + ",");
				} else {
					sql.append(param + ")");
				}
			} else {
				if (i != field.length - 1) {
					sql.append("'" + param + "',");
				} else {
					sql.append("'" + param + "')");
				}
			}
		}
		String flag = systemService.executeSql(sql);
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=delete")
	public void delete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		String ids = request.getParameter("ids");
		Map<String, Object> config = systemService.getConfig(funcId);
		String table = (String) config.get("TABLE");
		StringBuffer sql = new StringBuffer("UPDATE " + table
				+ " SET DEL_FLAG = 0 WHERE ID IN (" + ids + ")");
		String flag = systemService.executeSql(sql);
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=realDelete")
	public void realDelete(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		String ids = request.getParameter("ids");
		Map<String, Object> config = systemService.getConfig(funcId);
		String table = (String) config.get("TABLE");
		StringBuffer sql = new StringBuffer("DELETE FROM " + table
				+ " WHERE ID IN (" + ids + ")");
		String flag = systemService.executeSql(sql);
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=deleteByFields")
	public void deleteByFields(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String funcId = request.getParameter("funcId");
		Map<String, Object> config = systemService.getConfig(funcId);
		String fields = (String) config.get("FIELDS");
		String table = (String) config.get("TABLE");
		String[] field = {};
		String flag = "false";
		StringBuffer sql = new StringBuffer("DELETE FROM " + table + " WHERE ");
		if (fields != null && !fields.equals("")) {
			field = fields.split(",");
			for (int i = 0; i < field.length; i++) {
				String temp = field[i];
				String param = (String) request.getParameter(temp);
				if (i == 0) {
					sql.append(temp + " = '" + param + "'");
				} else {
					sql.append(" AND " + temp + " = '" + param + "'");
				}
			}
			flag = systemService.executeSql(sql);
		}
		String result = "{success:" + flag + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=uploadLogo")
	public void uploadLogo(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String old_file = request.getParameter("old_file");
		String url = systemService.upload(request, response);
		String realPath = request.getRealPath("/");
		int width = (request.getParameter("width") == null || request
				.getParameter("width").equals("")) ? 170 : Integer
				.parseInt(request.getParameter("width"));
		int height = (request.getParameter("height") == null || request
				.getParameter("width").equals("")) ? 170 : Integer
				.parseInt(request.getParameter("height"));
		if (request.getParameter("width") != null
				&& !request.getParameter("width").equals(""))
			width = Integer.parseInt(request.getParameter("width"));
		if (request.getParameter("height") != null
				&& !request.getParameter("height").equals(""))
			height = Integer.parseInt(request.getParameter("height"));
		String src = systemService.scale(realPath + url, width, height);
		systemService.deleteFile(realPath + url);
		systemService.deleteFile(old_file);
		response.getWriter()
				.print("{\"success\":true,\"url\":\"" + src + "\"}");

	}

	@RequestMapping(value = "/system.do", params = "action=changePwd")
	public void changePwd(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String oldPwd = request.getParameter("OLDPWD");
		String pwd = request.getParameter("PASSWORD");
		String loginName = request.getParameter("LOGINNAME");
		String success = systemService.changePwd(loginName, oldPwd, pwd);
		String result = "{success:" + success + "}";
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=getReportList")
	public void getReportList(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String s_id = request.getParameter("s_id");
		String date1 = request.getParameter("date1");
		String date2 = request.getParameter("date2");
		String time1 = request.getParameter("time1");
		String time2 = request.getParameter("time2");
		String type = request.getParameter("type");
		String start = date1 + " " + time1 + ":00";
		String end = date2 + " " + time2 + ":00";
		String result = systemService.getReportList(s_id, type, start, end);
		response.getWriter().print(result);
	}

	@RequestMapping(value = "/system.do", params = "action=expReport")
	public void expReport(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		String s_id = request.getParameter("s_id");
		String date1 = request.getParameter("date1");
		String date2 = request.getParameter("date2");
		String time1 = request.getParameter("time1");
		String time2 = request.getParameter("time2");
		String type = request.getParameter("type");
		String start = date1 + " " + time1;
		String end = date2 + " " + time2;
		List<Map<String, Object>> params = systemService.getParams(type);
		String name = (String) params.get(0).get("title");
		String filename = name + ".xls";
		filename = EncodeUtil.encodeFilename(filename, request);
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-disposition", "attachment;filename="
				+ filename);
		OutputStream out = response.getOutputStream();
		String result = systemService.getReportList(s_id, type, start, end);
		JSONObject jsonObject = JSONObject.fromObject(result);
		net.sf.json.JSONArray jsonArray = jsonObject.getJSONArray("data");
		ExpUtil expUtil = new ExpUtil();
		HSSFWorkbook book = null;
		try {
			book = expUtil.exportExcel(name,
					(String) params.get(0).get("columns"), jsonArray);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		book.write(out);// 输出
		out.flush();
		out.close();
	}

}
