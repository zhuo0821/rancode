package com.restaurant.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

import com.restaurant.bean.Member;
import com.restaurant.util.Common;

public class FrontService {
	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(FrontService.class);

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<Map<String, Object>> getAdList() {
		String sql = "select * from advertisement where del_flag = 1";
		List<Map<String, Object>> adList = new ArrayList<Map<String, Object>>();
		try {
			adList = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return adList;
	}

	public List<Map<String, Object>> getHotList(String s_id) {
		StringBuffer sql = new StringBuffer(
				"select * from product where del_flag = 1");
		if (s_id != null && !s_id.equals("")) {
			sql.append(" and s_id='" + s_id + "'");
		}
		sql.append(" order by sales_volume desc limit 0,5");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql.toString());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public List<Map<String, Object>> getNewList(String s_id) {
		StringBuffer sql = new StringBuffer(
				"select * from product where del_flag = 1");
		if (s_id != null && !s_id.equals("")) {
			sql.append(" and s_id='" + s_id + "'");
		}
		sql.append(" order by add_time desc limit 0,5");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql.toString());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public List<Map<String, Object>> getBestList(String s_id) {
		StringBuffer sql = new StringBuffer(
				"select * from product where del_flag = 1");
		if (s_id != null && !s_id.equals("")) {
			sql.append(" and s_id='" + s_id + "'");
		}
		sql.append(" order by order_index desc limit 0,5");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql.toString());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public String is_registered(String username) {
		String result = "true";
		String sql = "select count(id) from member where username = '"
				+ username + "'";
		int count = 0;
		if (Common.isNull(username))
			return "false";
		try {
			count = jdbcTemplate.queryForInt(sql);
			if (count > 0) {
				result = "false";
			}
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.info(e.getMessage());
		}
		return result;
	}

	public String check_email(String email) {
		String result = "ok";
		String sql = "select count(id) from member where email = '" + email
				+ "'";
		int count = 0;
		if (Common.isNull(email))
			return "false";
		try {
			count = jdbcTemplate.queryForInt(sql);
			if (count > 0) {
				result = "false";
			}
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.info(e.getMessage());
		}
		return result;
	}

	public String act_register(String username, String email, String password,
			String extend_field1, String extend_field2) {
		if (!"true".equals(this.is_registered(username)))
			return "对不起，该用户名已经被注册！";
		if (!"ok".equals(this.check_email(email)))
			return "对不起，该邮箱已经被注册了！";
		String addressSql = "insert into address(m_id,address,phone,default_flag) values(?,?,?,1)";
		String mIndexSql = "select ifnull(max(cast(id as unsigned int)),0) from member";
		String memberSql = "insert into member(id,username,password,status,email,phone) values (?,?,?,1,?,?)";
		try {
			int m_id = jdbcTemplate.queryForInt(mIndexSql);
			jdbcTemplate.update(memberSql, m_id + 1, username, password, email,
					extend_field1);
			jdbcTemplate.update(addressSql, m_id + 1, extend_field2,
					extend_field1);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
			return "对不起，系统出现错误，请您稍后再试！";
		}
		return "true";
	}

	public Member findMemberByUsername(String username) {
		String sql = "select * from member where username = ?";
		Member member = null;
		try {
			member = jdbcTemplate.queryForObject(sql,
					BeanPropertyRowMapper.newInstance(Member.class), username);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return member;
	}

	public List<Map<String, Object>> getOrderList(String s_id) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		StringBuffer sql = new StringBuffer(
				"select * from order_detail d,product p,order_form f where f.status = 2 and d.p_id = p.id and d.o_id=f.id");
		if (!Common.isNull(s_id)) {
			sql.append(" and f.s_id ='" + s_id + "'");
		}
		try {
			list = jdbcTemplate.queryForList(sql.toString());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public int getOrderCount(String s_id) {
		int count = 0; 
		StringBuffer sql = new StringBuffer("select count(id) from order_form o where o.status = 2");
		if(!Common.isNull(s_id)) {
			sql.append(" and o.s_id = '" + s_id +"'");
		}
		try {
			count = jdbcTemplate.queryForInt(sql.toString());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return count;
	}
	
	public double getMadeTime(String s_id) {
		double count = 0; 
		StringBuffer sql = new StringBuffer("select ifnull(sum(p.made_time),0) made_time from order_form o,order_detail d ,product p where p.id=d.p_id and d.o_id=o.id and o.status = 2");
		if(!Common.isNull(s_id)) {
			sql.append(" and o.s_id = '" + s_id +"'");
		}
		try {
			Map<String, Object> map= jdbcTemplate.queryForMap(sql.toString());
			count = (double) map.get("made_time");
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return count;
	}

	public boolean changePwd(String username, String password) {
		String sql = "update member set password = '" + password + "' where username = ?";
		boolean result = false;
		try {
			jdbcTemplate.update(sql,username);
			result = true;
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}
	
	public boolean update(Member member) {
		String sql = "update member set name=?,username=?,password=?,status=?," +
				"email=?,phone=?,last_login_time=?," +
				"outTime=?,code=?,question=?,answer=? where id=?";
		try {
			jdbcTemplate.update(sql, member.getName(), member.getUsername(),
					member.getPassword(), member.getStatus(),
					member.getEmail(), member.getPhone(),
					member.getLast_login_time(), member.getOutTime(),
					member.getCode(), member.getQuestion(), member.getAnswer(),
					member.getId());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
			return false;
		}
		return true;
	}

	public List<Map<String, Object>> getOrderList(Member member) {
		String sql = "select number,`time` order_time,`status` order_status,allcharge total from order_form o where m_id = ? order by (case status when 0 then 5 when 1 then 1 when 2 then 2 when 3 then 3 when 4 then 4 end),`time` desc";
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		try {
			result = jdbcTemplate.queryForList(sql,member.getId());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public List<Map<String, Object>> getOrderDetail(Member member,String number) {
		String sql = "select o.*,d.number count,d.amount,p.name,a.address,a.phone from order_form o,order_detail d,product p,address a where o.id=d.o_id and a.id=o.a_id and p.id=d.p_id and o.m_id = ? and o.number = ?";
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		try {
			result = jdbcTemplate.queryForList(sql,member.getId(),number);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}
	
	public List<Map<String, Object>> getOrderLocation(Member member,String number) {
		String sql = "select u.latitude,u.longitude from user u,order_form o where o.d_id = u.id and o.m_id = ? and o.number = ?";
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		try {
			result = jdbcTemplate.queryForList(sql,member.getId(),number);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean cancel_order(Member member, String order_number) {
		boolean result = false;
		String sql = "update order_form set status = 0 where number = ? and m_id = ?";
		try {
			jdbcTemplate.update(sql,order_number,member.getId());
			result = true;
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public List<Map<String, Object>> getAddressList(Member member) {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		String sql = "select * from address where m_id = ? and del_flag = 1";
		try {
			result = jdbcTemplate.queryForList(sql,member.getId());
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean editAddress(Member member, String address_id,
			String address, String mobile) {
		boolean result = false;
		String insert = "insert into address(m_id,address,phone) values (?,?,?)";
		String update = "update address set address=?,phone=? where m_id=? and id=?";
		try {
			if(Common.isNull(address_id)) {
				jdbcTemplate.update(insert,member.getId(),address,mobile);
			}else {
				jdbcTemplate.update(update,address,mobile,member.getId(),address_id);
			}
			result = true;
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public boolean drop_consignee(Member member, String id) {
		boolean result = false;
		String update = "update address set del_flag=0 where m_id=? and id=?";
		try {
			jdbcTemplate.update(update,member.getId(),id);
			result = true;
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public Map<String, Object> getArticleCat(String id) {
		String sql = "select * from topic where  del_flag = 1 and id=?";
		Map<String, Object> result = null;
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
			if (list.size() == 1) {
				result = list.get(0);
			}
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public List<Map<String, Object>> getArticleList(String id) {
		String sql = "select * from article where del_flag = 1 and t_id=?";
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql,id);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public Map<String, Object> getArticle(String id) {
		String sql = "select a.*,t.name t_name from article a,topic t where " +
				"a.t_id = t.id and a.del_flag = 1 and t.del_flag = 1 and a.id=?";
		Map<String, Object> result = null;
		try {
			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,id);
			if (list.size() == 1) {
				result = list.get(0);
			}
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

	public List<Map<String, Object>> getListBySql(String sql) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		try {
			list = jdbcTemplate.queryForList(sql);
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return list;
	}

	public boolean set_default(Member member, String id) {
		boolean result = false;
		String all = "update address set default_flag = 0 where m_id=?";
		String selet = "select count(*) from address where m_id=? and id=?";
		String update = "update address set default_flag=1 where m_id=? and id=?";
		try {
			int count = jdbcTemplate.queryForInt(selet,member.getId(),id);
			if(count == 1){
				jdbcTemplate.update(all,member.getId());
				jdbcTemplate.update(update,member.getId(),id);
				result = true;
			}
		} catch (Exception e) {
			logger.debug(e.getStackTrace());
			logger.error(e.getMessage());
		}
		return result;
	}

}
