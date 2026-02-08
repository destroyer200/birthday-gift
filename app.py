import streamlit as st
import time

# 1. Cấu hình trang web (Tab trên trình duyệt)
st.set_page_config(
    page_title="Happy Birthday!",
    page_icon="🎂",
    layout="centered"
)

# --- CSS Tùy chỉnh để giấu menu và làm đẹp ---
hide_menu_style = """
    <style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stApp {
        background-image: linear-gradient(to right top, #ffafbd, #ffc3a0);
        color: #4f4f4f;
    }
    </style>
    """
st.markdown(hide_menu_style, unsafe_allow_html=True)

# 2. Hàm kiểm tra mật khẩu (Tạo sự bí mật)
def check_password():
    """Returns `True` nếu người dùng nhập đúng mật khẩu."""
    def password_entered():
        if st.session_state["password"] == "2501":  # ĐỔI PASSWORD Ở ĐÂY (VD: Ngày sinh)
            st.session_state["password_correct"] = True
            del st.session_state["password"]  # Xóa pass khỏi session
        else:
            st.session_state["password_correct"] = False

    if "password_correct" not in st.session_state:
        # Lần đầu truy cập, hiện ô nhập pass
        st.text_input(
            "Mật mã trái tim (Nhập ngày sinh của em 'ddmm'):",
            type="password",
            on_change=password_entered,
            key="password"
        )
        return False
    elif not st.session_state["password_correct"]:
        # Nhập sai
        st.text_input(
            "Sai rồi bé ơi, thử lại đi nào (ddmm):",
            type="password",
            on_change=password_entered,
            key="password"
        )
        st.error("Mật khẩu không đúng! 😕")
        return False
    else:
        # Nhập đúng
        return True

# 3. Nội dung chính
if check_password():
    # Hiệu ứng phao bông ngay khi đăng nhập thành công
    st.balloons()

    # Tiêu đề
    st.title("🎉 Chúc Mừng Sinh Nhật Em! 🎂")
    st.write("---")

    # Phần 1: Ảnh kỷ niệm (Bạn có thể thay bằng ảnh thật)
    col1, col2, col3 = st.columns([1, 6, 1])
    with col2:
        # Thay link ảnh bên dưới bằng link ảnh của người yêu bạn
        st.image("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajF4bW5ibnJ2b3E4b3E4b3E4b3E4b3E4b3E4b3E4b3E4/LpDmM2wStDQs/giphy.gif", caption="Happy Birthday My Love ❤️")

    st.write("") # Khoảng cách
    st.header("💌 Gửi đến người con gái đặc biệt...")

    # Phần 2: Lời chúc chân thành
    st.write("""
    Chào tuổi mới xinh đẹp nhé!

    Anh làm cái app nho nhỏ này để lưu giữ lại khoảnh khắc này.
    Chúc em luôn vui vẻ, hạnh phúc và luôn là chính mình.
    Cảm ơn em đã xuất hiện trong cuộc đời anh.
    """)

    st.write("---")

    # Phần 3: Tương tác - Món quà bất ngờ
    st.subheader("🎁 Có một món quà nhỏ ở đây này...")
    if st.button("Mở Quà Ngay"):
        st.progress(0)
        for i in range(100):
            time.sleep(0.01) # Giả vờ load để hồi hộp
            st.progress(i + 1)

        st.success("Tadaaa! 🌹")
        st.write("Voucher: Được anh dẫn đi ăn bất cứ món gì em thích vào tối nay!")
        st.snow() # Hiệu ứng tuyết rơi lãng mạn