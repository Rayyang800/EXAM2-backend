from flask import Flask, request, jsonify, render_template, session, redirect, url_for, flash
from datetime import datetime
import sqlite3
import logging
import re 
import os


app = Flask(__name__)
app.secret_key = "secret-key"


# 路徑修改
def get_db_connection():
    conn = sqlite3.connect('shopping_data.db')
    if not os.path.exists('shopping_data.db'):
        logging.error(f"Database file not found at {'shopping_data.db'}")
        return None
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

# 補齊空缺程式碼
@app.route('/page_login', methods=['GET', 'POST'])
def page_login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_table WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['username'] = username
            return jsonify({"status": "success", "message": "登入成功"})
        else:
            return jsonify({"status": "error", "message": "帳號或密碼錯誤"})
    return render_template('page_login.html')
    
@app.route('/page_register', methods=['GET', 'POST'])
def page_register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        # 驗證 email 格式
        if not re.match(r"^[A-Za-z0-9._%+-]+@gmail\.com$", email):
            return jsonify({"status": "error", "message": "Email 格式不符重新輸入"})

        # 密碼驗證: 至少8字，包含大小寫
        if len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[a-z]', password):
            return jsonify({"status": "error", "message": "密碼必須超過8個字元且包含英文大小寫，重新輸入"})

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_table WHERE username = ?", (username,))
        exist = cursor.fetchone()

        if exist:
            # 若帳號已存在，更新密碼或信箱
            cursor.execute("UPDATE user_table SET password = ?, email = ? WHERE username = ?", (password, email, username))
            conn.commit()
            conn.close()
            return jsonify({"status": "info", "message": "帳號已存在，成功修改密碼或信箱"})

        # 若新帳號，新增
        cursor.execute("INSERT INTO user_table (username, password, email) VALUES (?, ?, ?)", (username, password, email))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "註冊成功"})
    return render_template('page_register.html')


def login_user(username, password):
    conn = get_db_connection()
    if conn is not None:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
            user = cursor.fetchone()
            if user:
                return {"status": "success", "message": "Login successful"}
            else:
                return {"status": "error", "message": "Invalid username or password"}
        except sqlite3.Error as e:
            logging.error(f"Database query error: {e}")
            return {"status": "error", "message": "An error occurred"}
        finally:
            conn.close()
    else:
        return {"status": "error", "message": "Database connection error"}

@app.route('/page_login' , methods=['GET', 'POST'])
def page_login():
    try:
        if request.method == 'POST':
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            result = login_user(username, password)
            if result["status"] == "success":
                session['username'] = username
            return jsonify(result)
        return render_template('page_login.html')
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 補齊剩餘副程式


# 補齊空缺程式碼
if __name__ == '__main__':
    app.run()


