from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import sqlite3, logging, re, os

app = Flask(__name__)
app.secret_key = "secret-key"

# --------------------------
# 取得資料庫連線
# --------------------------
def get_db_connection():
    db_path = 'shopping_data.db'
    if not os.path.exists(db_path):
        logging.error(f"❌ Database file not found at {db_path}")
        return None
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


# --------------------------
# 首頁導向登入頁
# --------------------------
@app.route('/')
def home():
    return redirect(url_for('page_login'))


# --------------------------
# 登入頁面
# --------------------------
@app.route('/page_login', methods=['GET', 'POST'])
def page_login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        if conn is None:
            return jsonify({"status": "error", "message": "資料庫連線失敗"}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['username'] = username
            # *** 修正：登入成功後，回傳跳轉的 URL ***
            return jsonify({"status": "success", "message": "登入成功", "redirect_url": url_for('shopping')})
        else:
            return jsonify({"status": "error", "message": "帳號或密碼錯誤"})
    return render_template('page_login_.html')

# --------------------------
# 註冊頁面
# --------------------------
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
        if conn is None:
            return jsonify({"status": "error", "message": "資料庫連線失敗"}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        exist = cursor.fetchone()

        if exist:
            cursor.execute("UPDATE users SET password = ?, email = ? WHERE username = ?", (password, email, username))
            conn.commit()
            conn.close()
            return jsonify({"status": "info", "message": "帳號已存在，成功修改密碼或信箱"})

        cursor.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", (username, password, email))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "message": "註冊成功"})
    return render_template('page_register.html')


# --------------------------
# 購物頁面
# --------------------------
@app.route('/shopping')
def shopping():
    if 'username' not in session:
        return redirect(url_for('page_login'))
    return render_template('index.html', username=session['username'])




# --------------------------
# 登出
# --------------------------
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('page_login'))


# --------------------------
# 主程式啟動
# --------------------------
if __name__ == '__main__':
    app.run(debug=True)
