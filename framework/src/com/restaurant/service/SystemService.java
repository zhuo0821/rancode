package com.restaurant.service;

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.restaurant.bean.Member;

public class SystemService {
	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(SystemService.class);

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public JSONArray getMenu(String id, String role,
			net.sf.json.JSONArray filters) {
		JSONArray menuArray = new JSONArray();
		StringBuffer sql = new StringBuffer(
				"SELECT * FROM MENU T WHERE T.PARENT_ID = ? ");
		if (role != null && !role.equals(""))
			sql.append(" AND T.ROLE = '" + role + "'");
		if (filters != null) {
			for (int i = 0; i < filters.size(); i++) {
				sql.append(" AND T."
						+ filters.getJSONObject(i).getString("property")
						+ " = '" + filters.getJSONObject(i).getString("value")
						+ "'");
			}
		}
		sql.append(" ORDER BY T.INDEX");
		List<Map<String, Object>> menuList = jdbcTemplate.queryForList(
				sql.toString(), id);
		for (Map<String, Object> temp : menuList) {
			if (temp.get("leaf").equals("true")) {
				temp.put("leaf", true);
			} else {
				temp.put("leaf", false);
			}
			menuArray.put(new org.json.JSONObject(temp));
		}
		return menuArray;
	}

	public Map<String, Object> getConfig(String funcId) {
		Map<String, Object> result = new HashMap<String, Object>();
		String sql = "SELECT * FROM FUNCTIONS T WHERE T.ID = ?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, funcId);
		result = list.get(0);
		return result;
	}

	public String getResult(StringBuffer sql, int limit, int start) {
		JSONArray result = new JSONArray();
		List<Map<String, Object>> menuList = jdbcTemplate.queryForList(sql
				.toString());
		if ((start + limit) > menuList.size() || limit == -1)
			limit = menuList.size();
		else
			limit += start;
		for (int i = start; i < limit; i++) {
			Map<String, Object> temp = menuList.get(i);
			result.put(new org.json.JSONObject(temp));
		}
		StringBuffer json = new StringBuffer();
		json.append("{\"success\":true,\"data\":");
		json.append(result);
		json.append(",\"totalCount\":");
		json.append(menuList.size());
		json.append("}");
		return json.toString();
	}

	public String executeSql(StringBuffer sql) {
		String flag = "false";
		try {
			jdbcTemplate.execute(sql.toString());
			flag = "true";
			logger.info(sql);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
			flag = "false";
		}
		return flag;
	}

	public String upload(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Iterator iter = multipartRequest.getFileNames();
		MultipartFile mFile = multipartRequest.getFile((String) iter.next());
		String fileName = mFile.getOriginalFilename();// 前台传入文件名称
		String realPath = request.getRealPath("/");// 获得项目目录名
		String prefix = String.valueOf(System.currentTimeMillis());// 根据系统时间生成上传后保存的文件名
		String extendName = fileName.substring(fileName.lastIndexOf("."));// 获得前台传入文件扩展名
		String localName = prefix + extendName;// 后台存储的文件名称
		String typeName = "file/img/";
		if (extendName.equals(".mp4"))
			typeName = "file/video/";
		String path = realPath + typeName;// 后台存储文件路径
		File filePath = new File(path);
		if (!filePath.exists()) {
			filePath.mkdirs();
		}
		File file = new File(path + localName);
		InputStream stream = mFile.getInputStream();
		FileOutputStream fs = new FileOutputStream(file);
		byte[] buffer = new byte[stream.available()];
		int bytesum = 0;
		int byteread = 0;
		while ((byteread = stream.read(buffer)) != -1) {
			bytesum += byteread;
			fs.write(buffer, 0, byteread);
			fs.flush();
		}
		fs.close();
		stream.close();
		return typeName + localName;
	}

	public String changePwd(String loginName, String oldPwd, String newPwd) {
		String result = "false";
		String sql = "UPDATE USER SET PASSWORD = ? WHERE ID = ? AND PASSWORD = ?";
		try {
			int flag = jdbcTemplate.update(sql, newPwd, loginName, oldPwd);
			if (flag == 1)
				result = "true";
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public int updateVideo(String url, String game_id, String id, String type) {
		int flag = 0;
		String sql = "UPDATE ATHLETE SET VIDEO_SRC = ? WHERE GAME_ID = ? AND ID = ?";
		if (type.equals("data"))
			sql = "UPDATE ATHLETE SET DATA_SRC = ? WHERE GAME_ID = ? AND ID = ?";
		try {
			jdbcTemplate.update(sql, url, game_id, id);
			flag = 1;
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return flag;
	}

	public boolean deleteFile(String sPath) {
		Boolean flag = false;
		File file = new File(sPath);
		// 路径为文件且不为空则进行删除
		if (file.isFile() && file.exists()) {
			file.delete();
			flag = true;
		}
		return flag;
	}

	public String scale(String file, int widths, int heights) {
		String newPath = this.getPath(file);
		try {
			BufferedImage src = ImageIO.read(new File(file)); // 读入文件
			Image image = src.getScaledInstance(widths, heights,
					Image.SCALE_DEFAULT);
			BufferedImage tag = new BufferedImage(widths, heights,
					BufferedImage.TYPE_INT_RGB);
			Graphics g = tag.getGraphics();
			g.drawImage(image, 0, 0, null); // 绘制缩小后的图
			g.dispose();
			ImageIO.write(tag, "JPEG", new File(newPath));// 输出到文件流
		} catch (IOException e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return "file/img/" + newPath.substring(newPath.lastIndexOf("/") + 1);
	}

	public String getPath(String file) {
		String name = file.substring(file.lastIndexOf("/") + 1,
				file.lastIndexOf("."));
		String prefix = String.valueOf(System.currentTimeMillis());
		file = file.replaceAll(name, prefix);
		return file;
	}

	public String getReportList(String s_id, String type, String start,
			String end) {
		// 主要是拼SQL语句，如果不能拼SQL语句的就写方法，返回值是字符串格式的json对象，形如{'success':true,'data':result}result为jsonArray
		String result = "";
		return result;
	}

	public List<Map<String, Object>> getParams(String name) {
		String sql = "select * from menu where name = ?";
		List<Map<String, Object>> list = new ArrayList<>();
		try {
			list = jdbcTemplate.queryForList(sql, name);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	

}
