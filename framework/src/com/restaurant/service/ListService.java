package com.restaurant.service;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.restaurant.bean.Category;
import com.restaurant.bean.Product;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;

public class ListService {
	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(ListService.class);

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public HashMap<String, List<Category>> getCategorys() {
		HashMap<String, List<Category>> categorys = new HashMap<String, List<Category>>();
		String query = "select * from varieties where node='root' and del_flag=1";
		List<Map<String, Object>> res = jdbcTemplate.queryForList(query);
		if (res != null) {
			for (Map<String, Object> row : res) {
				String id = row.get("id").toString();
				String name = row.get("name").toString();
				String key = id + "_" + name;
				query = "select * from varieties where node=" + id
						+ " and del_flag=1";
				List<Category> children = jdbcTemplate.query(query, new RowMapper<Category>() {
					@Override
					public Category mapRow(ResultSet arg0, int arg1)
							throws SQLException {
						Category cat = null;
						if(arg0 != null){
							cat = new Category();
							int id = arg0.getInt("id");
							String name = arg0.getString("name");
							String node = arg0.getString("node");
							cat.setId(id);
							cat.setName(name);
							cat.setNode(node);
						}
						return cat;
					}
				});
				categorys.put(key, children);
			}
		}
		return categorys;
	}
	
	public List<Product> getProducts(String cid,String isParent,String location,int page,int pageSize){
		List<Product> products = null;
		String query = "select * from product where s_id=" + location + " and del_flag=1 ";
		if(!cid.equals("0")){
			if(isParent.equals("true")){
				query += "and p_id=" + cid;
			}else {
				query += "and c_id=" + cid;
			}
		}
		query += " order by order_index desc ";
		if(page < 1){
			page = 1;
		}
		int begin = (page -1) * pageSize;
		query += "limit " + begin + " , " + pageSize;
		products = jdbcTemplate.query(query, new RowMapper<Product>(){
			@Override
			public Product mapRow(ResultSet arg0, int arg1) throws SQLException {
				Product p = null;
				if(arg0 != null){
					p = new Product();
					p.setId(arg0.getInt("id"));
					p.setC_id(arg0.getInt("c_id"));
					p.setS_id(arg0.getInt("s_id"));
					p.setAdd_time(arg0.getString("add_time"));
					p.setAmount(arg0.getInt("amount"));
					p.setDiscount(arg0.getFloat("discount"));
					p.setDiscount_flag(arg0.getInt("discount_flag"));
					p.setMade_time(arg0.getInt("made_time"));
					p.setName(arg0.getString("name"));
					p.setOrder_index(arg0.getInt("order_index"));
					p.setPic(arg0.getString("pic"));
					p.setP_id(arg0.getInt("p_id"));
					p.setPrice(arg0.getFloat("price"));
					p.setSales_volume(arg0.getInt("sales_volume"));
					p.setMade_volume(arg0.getInt("made_volume"));
				}
				return p;
			}
		});
		return products;
	}
	
	public List<Product> getProducts(String key,String location,String page,int pageSize){
		List<Product> products = null;
		int begin = 0;
		if(page != null && !page.equals("")){
			int p = Integer.parseInt(page);
			if(p < 1){
				p = 1;
			}
			begin = (p - 1) * pageSize;
		}
		String query = "select * from product where name like '%"+ key +"%' and s_id=" + location + " and del_flag=1 limit " + begin + " , " + pageSize;
		System.out.println(query);
		products = jdbcTemplate.query(query, new RowMapper<Product>(){
			@Override
			public Product mapRow(ResultSet arg0, int arg1) throws SQLException {
				Product p = null;
				if(arg0 != null){
					p = new Product();
					p.setId(arg0.getInt("id"));
					p.setC_id(arg0.getInt("c_id"));
					p.setS_id(arg0.getInt("s_id"));
					p.setAdd_time(arg0.getString("add_time"));
					p.setAmount(arg0.getInt("amount"));
					p.setDiscount(arg0.getFloat("discount"));
					p.setDiscount_flag(arg0.getInt("discount_flag"));
					p.setMade_time(arg0.getInt("made_time"));
					p.setName(arg0.getString("name"));
					p.setOrder_index(arg0.getInt("order_index"));
					p.setPic(arg0.getString("pic"));
					p.setP_id(arg0.getInt("p_id"));
					p.setPrice(arg0.getFloat("price"));
					p.setSales_volume(arg0.getInt("sales_volume"));
					p.setMade_volume(arg0.getInt("made_volume"));
				}
				return p;
			}
		});
		return products;
	}
	
	public List<Product> getProducts(String price,String location,String cid,String isParent,String page,int pageSize){
		List<Product> products = null;
		int begin = 0;
		if(page != null && !page.equals("")){
			int p = Integer.parseInt(page);
			if(p < 1){
				p = 1;
			}
			begin = (p - 1) * pageSize;
		}
		if(price != null){
			String begPrice = price.substring(0,price.indexOf('-'));
			String endPrice = price.substring(price.indexOf('-')+1);
			String query = "select * from product where price >= "+ begPrice.trim() +" and price <= "+ endPrice.trim() +"  and s_id=" + location + " and del_flag=1 ";
			if(isParent.equals("true")){
				query += " and p_id="+cid;
			}else {
				query += " and c_id="+cid;
			}
			query += " limit " + begin + " , " + pageSize;
			System.out.println(query);
			products = jdbcTemplate.query(query, new RowMapper<Product>(){
				@Override
				public Product mapRow(ResultSet arg0, int arg1) throws SQLException {
					Product p = null;
					if(arg0 != null){
						p = new Product();
						p.setId(arg0.getInt("id"));
						p.setC_id(arg0.getInt("c_id"));
						p.setS_id(arg0.getInt("s_id"));
						p.setAdd_time(arg0.getString("add_time"));
						p.setAmount(arg0.getInt("amount"));
						p.setDiscount(arg0.getFloat("discount"));
						p.setDiscount_flag(arg0.getInt("discount_flag"));
						p.setMade_time(arg0.getInt("made_time"));
						p.setName(arg0.getString("name"));
						p.setOrder_index(arg0.getInt("order_index"));
						p.setPic(arg0.getString("pic"));
						p.setP_id(arg0.getInt("p_id"));
						p.setPrice(arg0.getFloat("price"));
						p.setSales_volume(arg0.getInt("sales_volume"));
						p.setMade_volume(arg0.getInt("made_volume"));
					}
					return p;
				}
			});
		}
		return products;
	}
	
	public String getStoreId(Cookie[] cookies){
		String storeId = "";
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equalsIgnoreCase("storeId")) {
					storeId = cookie.getValue();
				}
			}
		}
		return storeId;
	}
	
	public Category getCategory(String id){
		Category cat = null;
		String query = "select * from varieties where id=" + id + " and del_flag=1";
		System.out.println(query);
		cat = jdbcTemplate.queryForObject(query, new RowMapper<Category>(){
			public Category mapRow(ResultSet arg0, int arg1)
					throws SQLException {
				Category cate = null;
				if(arg0 != null){
					cate = new Category();
					cate.setId(arg0.getInt("id"));
					cate.setName(arg0.getString("name"));
					cate.setNode(arg0.getString("node"));
				}
				return cate;
			}
			
		});
		return cat;
	}
	
	
	
	
	
	
	
	
	
}
