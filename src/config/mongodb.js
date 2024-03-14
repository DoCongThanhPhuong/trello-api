import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

// Khởi tạo đối tượng trelloDatabaseInstance ban đầu là null (vì chúng ta chưa connect)
let trelloDatabaseInstance = null

// Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  // Lưu ý: serverAPI có từ phiên bản MongoDB 5.0.0 trở lên, có thể không cần dùng nó, nếu dùng nó là chúng ta sẽ chỉ định một cái Stable API Version của MongoDB
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Kết nối tới Database
export const CONNECT_DB = async () => {
  // Gọi kết nối tới Database Atlas với URI đã khai báo trong thân của clientInstance
  await mongoClientInstance.connect()

  // Kết nối thành công thì lấy Database ra theo tên và gán ngược nó vào biến trelloDatabaseInstance ở trên
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Đóng kết nối tới database khi cần
export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

/** Function GET_DB (không phải async) này có nhiệm vụ export ra cái trelloDatabaseInstance sau khi đã connect thành công
 * tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code dự án
 * Lưu ý: Phải đảm bảo chỉ gọi GET_DB sau khi đã kết nối thành công tới MongoDB */
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}
