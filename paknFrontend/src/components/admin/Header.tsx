export default function Header() {

  const style = {
    height: 60,
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #ddd"
  }

  return (
    <div style={style}>
      <h3>Hệ thống quản lý phản ánh</h3>

      <div>
        Admin
      </div>
    </div>
  )
}