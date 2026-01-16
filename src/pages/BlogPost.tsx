import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Calendar, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react'

interface BlogPostData {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  slug: string
  content: {
    intro: string
    sections: {
      heading: string
      content: string
      list?: string[]
    }[]
    conclusion: string
  }
  keywords: string[]
  relatedPosts: string[]
}

const blogPostsData: Record<string, BlogPostData> = {
  'ngay-tot-khai-truong-2026': {
    id: '1',
    title: 'Top 10 Ngày Tốt Khai Trương Năm 2026 Theo Phong Thủy',
    excerpt: 'Xem ngày hoàng đạo khai trương kinh doanh năm Bính Ngọ 2026. Chọn ngày tốt giờ đẹp để thu hút tài lộc, khách hàng ùn ùn, kinh doanh phát đạt.',
    date: '14/01/2026',
    readTime: '8 phút',
    category: 'Xem Ngày Tốt',
    slug: 'ngay-tot-khai-truong-2026',
    keywords: ['ngày tốt khai trương 2026', 'ngày hoàng đạo', 'xem ngày khai trương', 'phong thủy kinh doanh'],
    relatedPosts: ['ngay-cuoi-tot-2026', 'huong-nha-tot-2026'],
    content: {
      intro: 'Khai trương cửa hàng, văn phòng là sự kiện quan trọng đánh dấu bước khởi đầu của công việc kinh doanh. Chọn ngày giờ tốt theo phong thủy không chỉ mang ý nghĩa tâm linh mà còn tạo động lực tích cực cho chủ doanh nghiệp và nhân viên. Dưới đây là 10 ngày tốt nhất để khai trương trong năm Bính Ngọ 2026.',
      sections: [
        {
          heading: '1. Tại Sao Cần Chọn Ngày Tốt Khai Trương?',
          content: 'Theo quan niệm phong thủy Việt Nam, ngày giờ khai trương ảnh hưởng trực tiếp đến vận may của doanh nghiệp. Chọn đúng ngày giờ hoàng đạo sẽ:',
          list: [
            'Thu hút khách hàng, tài lộc dồi dào',
            'Tránh xui xẻo, tai họa trong kinh doanh',
            'Tạo khí thế tích cực cho đội ngũ nhân viên',
            'Giúp công việc thuận lợi, phát triển bền vững'
          ]
        },
        {
          heading: '2. Các Yếu Tố Cần Xem Xét Khi Chọn Ngày Khai Trương',
          content: 'Không phải ngày tốt chung nào cũng phù hợp với mọi người. Cần xem xét:',
          list: [
            'Tuổi của chủ doanh nghiệp (tuổi chủ)',
            'Hướng cửa hàng, văn phòng',
            'Ngành nghề kinh doanh',
            'Tháng, ngày, giờ hoàng đạo theo lịch Việt',
            'Tránh các ngày phạm tuổi, ngày hoang vong, ngày sát chủ'
          ]
        },
        {
          heading: '3. Top 10 Ngày Tốt Khai Trương Năm 2026',
          content: 'Dựa trên lịch phong thủy năm Bính Ngọ 2026, đây là 10 ngày tốt nhất cho khai trương:',
          list: [
            'Ngày 15/01/2026 (Dương) - 16/12/2025 (Âm): Ngày Hoàng Đạo, hợp mệnh Kim, Thủy',
            'Ngày 20/02/2026 (Dương) - 23/01/2026 (Âm): Ngày Thiên Đức, hợp khai trương nhà hàng',
            'Ngày 08/03/2026 (Dương) - 09/02/2026 (Âm): Ngày Nguyệt Đức, hợp cửa hàng thời trang',
            'Ngày 12/04/2026 (Dương) - 15/03/2026 (Âm): Ngày Hoàng Đạo, hợp văn phòng công ty',
            'Ngày 05/05/2026 (Dương) - 09/04/2026 (Âm): Ngày Tam Hợp, hợp mọi ngành nghề',
            'Ngày 18/06/2026 (Dương) - 24/05/2026 (Âm): Ngày Thiên Quan, hợp kinh doanh xuất nhập khẩu',
            'Ngày 22/07/2026 (Dương) - 29/06/2026 (Âm): Ngày Hoàng Đạo, hợp spa, thẩm mỹ viện',
            'Ngày 10/08/2026 (Dương) - 18/07/2026 (Âm): Ngày Nguyệt Đức, hợp quán cafe, trà sữa',
            'Ngày 15/09/2026 (Dương) - 25/08/2026 (Âm): Ngày Tam Hợp, hợp shop online',
            'Ngày 20/10/2026 (Dương) - 02/10/2026 (Âm): Ngày Thiên Đức, hợp mọi loại hình kinh doanh'
          ]
        },
        {
          heading: '4. Giờ Tốt Để Khai Trương',
          content: 'Ngoài ngày tốt, giờ khai trương cũng rất quan trọng. Các giờ hoàng đạo thường được chọn:',
          list: [
            'Giờ Tý (23h - 1h): Hợp khai trương quán ăn, nhà hàng',
            'Giờ Mão (5h - 7h): Hợp cửa hàng thời trang, mỹ phẩm',
            'Giờ Ngọ (11h - 13h): Hợp văn phòng, công ty',
            'Giờ Thân (15h - 17h): Hợp shop online, kinh doanh online',
            'Giờ Dậu (17h - 19h): Hợp quán cafe, giải trí'
          ]
        },
        {
          heading: '5. Nghi Thức Khai Trương Chuẩn Phong Thủy',
          content: 'Để buổi khai trương thêm phần linh thiêng và may mắn, hãy thực hiện các nghi thức sau:',
          list: [
            'Cúng khai trương với mâm cỗ truyền thống',
            'Đốt nhang, khấn vái trời đất, thần linh',
            'Cắt băng khai trương vào đúng giờ hoàng đạo',
            'Mời khách hàng đầu tiên vào mua sắm (khách lộc)',
            'Trang trí cửa hàng với hoa tươi, đèn đỏ, pháo giấy',
            'Phát lộc đầu năm cho khách hàng (tiền lì xì, quà tặng)'
          ]
        }
      ],
      conclusion: 'Chọn ngày tốt khai trương là bước đầu quan trọng giúp doanh nghiệp khởi đầu thuận lợi. Tuy nhiên, yếu tố quan trọng nhất vẫn là sự chuẩn bị kỹ lưỡng về sản phẩm, dịch vụ và tâm huyết của chủ doanh nghiệp. Kết hợp phong thủy với nỗ lực thực tế sẽ giúp công việc kinh doanh phát triển bền vững. Chúc bạn khai trương thành công, tài lộc dồi dào!'
    }
  },
  'tu-vi-12-con-giap-2026': {
    id: '2',
    title: 'Tử Vi 12 Con Giáp Năm 2026: Ai Gặp Nhiều May Mắn Nhất?',
    excerpt: 'Xem tử vi 12 con giáp năm Ngựa 2026. Dự đoán vận may tài lộc, sự nghiệp, tình duyên, sức khỏe cho từng tuổi. Năm 2026 tuổi nào hợp xui?',
    date: '13/01/2026',
    readTime: '12 phút',
    category: 'Tử Vi',
    slug: 'tu-vi-12-con-giap-2026',
    keywords: ['tử vi 2026', '12 con giáp', 'năm Bính Ngọ', 'vận may 2026'],
    relatedPosts: ['tuoi-ty-nam-2026', 'mau-sac-may-man-2026'],
    content: {
      intro: 'Năm 2026 là năm Bính Ngọ (năm Ngựa), một năm đầy biến động và cơ hội. Mỗi con giáp sẽ có những vận may khác nhau về tài lộc, sự nghiệp, tình duyên và sức khỏe. Dưới đây là dự đoán chi tiết cho từng tuổi.',
      sections: [
        {
          heading: '1. Tuổi Tý (Chuột) - 1948, 1960, 1972, 1984, 1996, 2008, 2020',
          content: 'Năm 2026 là năm thuận lợi cho tuổi Tý. Sự nghiệp phát triển, tài lộc dồi dào nhờ có quý nhân phù trợ. Tình duyên cũng khá tốt, người độc thân có cơ hội gặp được nửa kia. Tuy nhiên, cần chú ý sức khỏe vào giữa năm.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐ - Thăng tiến, có cơ hội làm việc lớn',
            'Tài lộc: ⭐⭐⭐⭐ - Thu nhập tăng, đầu tư có lãi',
            'Tình duyên: ⭐⭐⭐ - Độc thân gặp người ý trung',
            'Sức khỏe: ⭐⭐⭐ - Cần chú ý hệ tiêu hóa'
          ]
        },
        {
          heading: '2. Tuổi Sửu (Trâu) - 1949, 1961, 1973, 1985, 1997, 2009, 2021',
          content: 'Năm Bính Ngọ không quá thuận lợi cho tuổi Sửu. Công việc gặp nhiều trở ngại, cần kiên nhẫn vượt qua. Tài chính ổn định nhưng không có bước đột phá. Tình duyên bình thường, cần quan tâm gia đình hơn.',
          list: [
            'Sự nghiệp: ⭐⭐ - Nhiều khó khăn, cần kiên trì',
            'Tài lộc: ⭐⭐⭐ - Ổn định, tránh đầu tư mạo hiểm',
            'Tình duyên: ⭐⭐ - Cần giao tiếp cởi mở hơn',
            'Sức khỏe: ⭐⭐ - Chú ý xương khớp, nghỉ ngơi đầy đủ'
          ]
        },
        {
          heading: '3. Tuổi Dần (Hổ) - 1950, 1962, 1974, 1986, 1998, 2010, 2022',
          content: 'Năm 2026 là năm may mắn với tuổi Dần. Sự nghiệp thăng hoa, có nhiều cơ hội mới. Tài chính dồi dào nhờ công việc và đầu tư thành công. Tình duyên ngọt ngào, hôn nhân hạnh phúc.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐⭐ - Thăng hoa, nhiều dự án lớn',
            'Tài lộc: ⭐⭐⭐⭐ - Tài lộc dồi dào từ nhiều nguồn',
            'Tình duyên: ⭐⭐⭐⭐ - Ngọt ngào, hạnh phúc',
            'Sức khỏe: ⭐⭐⭐⭐ - Tốt, đầy năng lượng'
          ]
        },
        {
          heading: '4. Tuổi Mão (Mèo) - 1951, 1963, 1975, 1987, 1999, 2011',
          content: 'Tuổi Mão gặp nhiều may mắn trong năm Bính Ngọ. Công việc suôn sẻ, được cấp trên đánh giá cao. Tài chính ổn định, có khoản thu bất ngờ. Tình duyên tốt, gia đình ấm áp.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐ - Thuận lợi, được đánh giá cao',
            'Tài lộc: ⭐⭐⭐⭐ - Thu nhập tăng, có khoản lãi bất ngờ',
            'Tình duyên: ⭐⭐⭐⭐ - Hạnh phúc, gia đình ấm áp',
            'Sức khỏe: ⭐⭐⭐ - Tốt, chú ý hệ hô hấp'
          ]
        },
        {
          heading: '5. Tuổi Thìn (Rồng) - 1952, 1964, 1976, 1988, 2000, 2012',
          content: 'Năm 2026 là năm trung bình với tuổi Thìn. Sự nghiệp có chút khó khăn trong quý đầu năm nhưng sẽ cải thiện sau đó. Tài chính ổn định. Tình duyên cần quan tâm nhiều hơn.',
          list: [
            'Sự nghiệp: ⭐⭐⭐ - Khó khăn ban đầu, cải thiện sau',
            'Tài lộc: ⭐⭐⭐ - Ổn định, tiết kiệm chi tiêu',
            'Tình duyên: ⭐⭐ - Cần dành thời gian cho người thân',
            'Sức khỏe: ⭐⭐⭐ - Tốt, tránh căng thẳng'
          ]
        },
        {
          heading: '6. Tuổi Tỵ (Rắn) - 1953, 1965, 1977, 1989, 2001, 2013',
          content: 'Năm Bính Ngọ là năm phạm tuổi của tuổi Tỵ. Cần hết sức cẩn thận trong mọi việc. Công việc có thể gặp nhiều thử thách, tài chính cần tiết kiệm. Tuy nhiên, nếu vượt qua được sẽ rèn luyện bản thân tốt hơn.',
          list: [
            'Sự nghiệp: ⭐⭐ - Phạm tuổi, nhiều thử thách',
            'Tài lộc: ⭐⭐ - Tránh đầu tư mạo hiểm, tiết kiệm',
            'Tình duyên: ⭐⭐ - Cần bình tĩnh, tránh tranh cãi',
            'Sức khỏe: ⭐⭐ - Chú ý an toàn, kiểm tra định kỳ'
          ]
        },
        {
          heading: '7. Tuổi Ngọ (Ngựa) - 1954, 1966, 1978, 1990, 2002, 2014',
          content: 'Tuổi Ngọ có một năm khá thuận lợi. Sự nghiệp phát triển tốt với nhiều cơ hội mới. Tài chính dồi dào. Tình duyên ngọt ngào, có tin vui trong gia đình.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐ - Phát triển tốt, nhiều cơ hội',
            'Tài lộc: ⭐⭐⭐⭐ - Thu nhập cao, đầu tư có lãi',
            'Tình duyên: ⭐⭐⭐⭐ - Ngọt ngào, có tin vui',
            'Sức khỏe: ⭐⭐⭐ - Tốt, chú ý nghỉ ngơi'
          ]
        },
        {
          heading: '8. Tuổi Mùi (Dê) - 1955, 1967, 1979, 1991, 2003, 2015',
          content: 'Năm 2026 là năm bình thường với tuổi Mùi. Công việc ổn định nhưng không có bước đột phá lớn. Tài chính đủ dùng. Tình duyên bình yên, gia đình hạnh phúc.',
          list: [
            'Sự nghiệp: ⭐⭐⭐ - Ổn định, ít biến động',
            'Tài lộc: ⭐⭐⭐ - Đủ dùng, không xa hoa',
            'Tình duyên: ⭐⭐⭐ - Bình yên, gia đình ấm áp',
            'Sức khỏe: ⭐⭐⭐ - Tốt, duy trì tập luyện'
          ]
        },
        {
          heading: '9. Tuổi Thân (Khỉ) - 1956, 1968, 1980, 1992, 2004, 2016',
          content: 'Tuổi Thân có năm may mắn với nhiều cơ hội. Sự nghiệp thăng tiến nhanh. Tài chính dồi dào nhờ sự thông minh và nhanh nhẹn. Tình duyên cũng khá tốt.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐⭐ - Thăng tiến nhanh, nhiều cơ hội',
            'Tài lộc: ⭐⭐⭐⭐⭐ - Dồi dào, đầu tư thành công',
            'Tình duyên: ⭐⭐⭐⭐ - Tốt, có nhiều lựa chọn',
            'Sức khỏe: ⭐⭐⭐⭐ - Tốt, năng động'
          ]
        },
        {
          heading: '10. Tuổi Dậu (Gà) - 1957, 1969, 1981, 1993, 2005, 2017',
          content: 'Năm 2026 là năm trung bình với tuổi Dậu. Công việc có nhiều thay đổi, cần linh hoạt thích nghi. Tài chính ổn định. Tình duyên cần quan tâm hơn.',
          list: [
            'Sự nghiệp: ⭐⭐⭐ - Nhiều thay đổi, cần linh hoạt',
            'Tài lộc: ⭐⭐⭐ - Ổn định, tránh xa hoa',
            'Tình duyên: ⭐⭐ - Cần dành thời gian cho gia đình',
            'Sức khỏe: ⭐⭐⭐ - Tốt, chú ý tinh thần'
          ]
        },
        {
          heading: '11. Tuổi Tuất (Chó) - 1958, 1970, 1982, 1994, 2006, 2018',
          content: 'Tuổi Tuất có một năm khá thuận lợi. Công việc phát triển tốt nhờ sự trung thành và chăm chỉ. Tài chính ổn định và tăng trưởng. Tình duyên hạnh phúc.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐ - Phát triển tốt, được đánh giá cao',
            'Tài lộc: ⭐⭐⭐⭐ - Tăng trưởng ổn định',
            'Tình duyên: ⭐⭐⭐⭐ - Hạnh phúc, chung thuỷ',
            'Sức khỏe: ⭐⭐⭐ - Tốt, duy trì lối sống lành mạnh'
          ]
        },
        {
          heading: '12. Tuổi Hợi (Heo) - 1959, 1971, 1983, 1995, 2007, 2019',
          content: 'Năm 2026 là năm tốt với tuổi Hợi. Sự nghiệp có nhiều cơ hội mới. Tài chính dồi dào. Tình duyên ngọt ngào, có thể có tin vui lớn.',
          list: [
            'Sự nghiệp: ⭐⭐⭐⭐ - Nhiều cơ hội, phát triển tốt',
            'Tài lộc: ⭐⭐⭐⭐ - Dồi dào, có lộc bất ngờ',
            'Tình duyên: ⭐⭐⭐⭐ - Ngọt ngào, có tin vui',
            'Sức khỏe: ⭐⭐⭐⭐ - Tốt, vui vẻ'
          ]
        }
      ],
      conclusion: 'Tử vi chỉ là tham khảo giúp bạn chuẩn bị tinh thần cho năm mới. Yếu tố quan trọng nhất vẫn là nỗ lực, thái độ tích cực và sự chuẩn bị kỹ lưỡng. Dù tuổi nào cũng có thể tạo ra may mắn của riêng mình. Chúc bạn một năm 2026 thành công, hạnh phúc và tràn đầy năng lượng tích cực!'
    }
  },
  // Thêm các bài viết còn lại với cấu trúc tương tự
  'phong-thuy-tet-2026': {
    id: '3',
    title: 'Phong Thủy Tết 2026: Cách Bày Trí Nhà Cửa Đón Lộc Về',
    excerpt: 'Hướng dẫn bày trí phòng khách, bàn thờ Tết 2026 theo phong thủy. Màu sắc, vật phẩm may mắn cho năm Bính Ngọ. Đặt cây cảnh, tranh ảnh nơi nào?',
    date: '12/01/2026',
    readTime: '10 phút',
    category: 'Phong Thủy Nhà Ở',
    slug: 'phong-thuy-tet-2026',
    keywords: ['phong thủy tết 2026', 'bày trí nhà cửa', 'trang trí tết', 'phong thủy năm Bính Ngọ'],
    relatedPosts: ['huong-nha-tot-2026', 'mau-sac-may-man-2026'],
    content: {
      intro: 'Tết Nguyên Đán là dịp quan trọng nhất trong năm. Việc bày trí nhà cửa theo phong thủy không chỉ mang ý nghĩa tâm linh mà còn tạo không gian sống hài hòa, thu hút tài lộc và may mắn cho cả năm. Dưới đây là hướng dẫn chi tiết cách bày trí nhà cửa đón Tết Bính Ngọ 2026.',
      sections: [
        {
          heading: '1. Nguyên Tắc Cơ Bản Phong Thủy Tết',
          content: 'Trước khi bắt tay vào bày trí, cần nắm vững những nguyên tắc cơ bản:',
          list: [
            'Dọn dẹp nhà cửa sạch sẽ, thoáng đãng trước Tết',
            'Loại bỏ đồ cũ, hỏng hóc để đón năng lượng mới',
            'Chọn màu sắc và vật phẩm hợp mệnh chủ nhà',
            'Tránh đặt vật phẩm sắc nhọn hướng vào người',
            'Ưu tiên ánh sáng tự nhiên, không gian thoáng mát'
          ]
        },
        {
          heading: '2. Bày Trí Phòng Khách Đón Khách',
          content: 'Phòng khách là nơi đón khách đầu năm, rất quan trọng về phong thủy:',
          list: [
            'Sofa đặt sát tường vững chắc, tránh để lưng sofa hướng cửa',
            'Bàn trà hình tròn hoặc oval, tránh góc nhọn',
            'Treo tranh phong cảnh, hoa lá tươi tốt (tránh tranh thác nước đổ xuống)',
            'Đặt cây kim tiền, cây phát tài ở góc phòng',
            'Trang trí hoa tươi màu đỏ, vàng (hoa mai, đào, lan)',
            'Thắp đèn sáng, tránh góc tối'
          ]
        },
        {
          heading: '3. Bàn Thờ Tổ Tiên Linh Thiêng',
          content: 'Bàn thờ là nơi linh thiêng nhất trong nhà, cần bày trí trang trọng:',
          list: [
            'Đặt bàn thờ ở vị trí cao, trang trọng nhất',
            'Hướng bàn thờ: Nam, Đông Bắc hoặc Tây Bắc (tùy hướng nhà)',
            'Lau dọn bàn thờ sạch sẽ, thay nước hoa tươi hàng ngày',
            'Cúng 5 quả truyền thống (chuối, dừa, đu đủ, xoài, mãng cầu)',
            'Thắp hương đúng giờ, không để tro rơi xuống sàn',
            'Tránh đặt bàn thờ đối diện toilet, cửa chính'
          ]
        },
        {
          heading: '4. Phòng Ngủ An Lành',
          content: 'Phòng ngủ là nơi nghỉ ngơi, cần yên tĩnh và hài hòa:',
          list: [
            'Giường ngủ đặt sát tường vững chắc, đầu giường hướng Đông hoặc Nam',
            'Tránh đặt gương đối diện giường ngủ',
            'Màu sắc nhẹ nhàng (trắng, kem, hồng nhạt)',
            'Không để cây cảnh lớn trong phòng ngủ',
            'Trang trí tranh ảnh gia đình hạnh phúc',
            'Giữ phòng ngủ gọn gàng, không lộn xộn'
          ]
        },
        {
          heading: '5. Bếp Ăn - Trung Tâm Tài Lộc',
          content: 'Bếp là nơi sinh ra tài lộc, cần đặc biệt chú ý:',
          list: [
            'Bếp hướng Đông hoặc Đông Nam để đón khí tốt',
            'Tránh đặt bếp đối diện với cửa chính hoặc toilet',
            'Giữ bếp sạch sẽ, không để đồ bẩn qua đêm',
            'Đặt bình gạo đầy, biểu tượng của sự no đủ',
            'Trang trí hoa quả tươi trên bàn ăn',
            'Thắp đèn sáng trong bếp, tránh tối tăm'
          ]
        },
        {
          heading: '6. Cửa Chính - Cổng Đón Lộc',
          content: 'Cửa chính là nơi đón khí tốt vào nhà:',
          list: [
            'Sơn lại cửa màu đỏ, vàng hoặc nâu gỗ',
            'Dán câu đối Tết hai bên cửa',
            'Đặt chậu cây tươi tốt hai bên cửa',
            'Thay thảm chùi chân mới',
            'Treo đèn lồng đỏ hoặc dây đèn LED',
            'Tránh để rác, đồ cũ trước cửa'
          ]
        },
        {
          heading: '7. Màu Sắc May Mắn Năm Bính Ngọ 2026',
          content: 'Năm Ngựa 2026 hợp với các màu sắc sau:',
          list: [
            'Đỏ: Màu truyền thống của Tết, mang lại may mắn',
            'Vàng, Cam: Thu hút tài lộc, giàu sang',
            'Xanh lá: Hợp mệnh Mộc, sức khỏe tốt',
            'Trắng, Bạc: Hợp mệnh Kim, sự nghiệp thăng tiến',
            'Tránh: Đen, xanh đen (không hợp năm Ngựa)'
          ]
        },
        {
          heading: '8. Vật Phẩm Phong Thủy Nên Có',
          content: 'Các vật phẩm phong thủy mang lại may mắn cho năm 2026:',
          list: [
            'Cây kim tiền, cây phát tài - Thu hút tài lộc',
            'Mèo thần tài - Đón khách, mang lại tài lộc',
            'Tượng Phật Di Lạc - Mang lại hạnh phúc, thịnh vượng',
            'Tranh 9 con cá chép - Tài lộc dồi dào',
            'Hoa sen gỗ - Thanh cao, tươi sạch',
            'Đồng xu năm tệ - Biểu tượng của sự giàu có'
          ]
        }
      ],
      conclusion: 'Bày trí nhà cửa theo phong thủy không chỉ mang ý nghĩa tâm linh mà còn tạo không gian sống hài hòa, tích cực cho cả gia đình. Kết hợp với sự chăm chỉ và nỗ lực của bản thân, bạn sẽ có một năm mới thành công, hạnh phúc và tràn đầy năng lượng tích cực. Chúc bạn và gia đình một năm Bính Ngọ 2026 an khang thịnh vượng!'
    }
  },
  'ngay-cuoi-tot-2026': {
    id: '4',
    title: 'Xem Ngày Cưới Tốt Năm 2026 Cho Cặp Đôi',
    excerpt: 'Chọn ngày cưới hỏi, ăn hỏi, đính hôn năm 2026 hợp tuổi vợ chồng. Tránh ngày xấu, chọn tháng tốt kết hôn để hôn nhân hạnh phúc trăm năm.',
    date: '11/01/2026',
    readTime: '9 phút',
    category: 'Xem Ngày Tốt',
    slug: 'ngay-cuoi-tot-2026',
    keywords: ['ngày cưới tốt 2026', 'xem ngày cưới', 'ngày hoàng đạo cưới hỏi', 'chọn ngày đám cưới'],
    relatedPosts: ['ngay-tot-khai-truong-2026', 'tu-vi-12-con-giap-2026'],
    content: {
      intro: 'Đám cưới là sự kiện trọng đại nhất trong đời mỗi người. Chọn ngày cưới tốt theo phong thủy không chỉ mang ý nghĩa tâm linh mà còn tạo nền tảng vững chắc cho hạnh phúc gia đình. Dưới đây là những ngày cưới tốt nhất năm Bính Ngọ 2026.',
      sections: [
        {
          heading: '1. Tại Sao Cần Chọn Ngày Cưới Tốt?',
          content: 'Chọn ngày cưới hợp tuổi vợ chồng sẽ mang lại nhiều may mắn:',
          list: [
            'Hôn nhân hạnh phúc, vợ chồng hòa thuận',
            'Tránh khẩu thiệt, tranh cãi không đáng có',
            'Con cái ngoan ngoãn, học hành tốt',
            'Tài lộc dồi dào, sự nghiệp thuận lợi',
            'Gia đình đầm ấm, sum vầy'
          ]
        },
        {
          heading: '2. Yếu Tố Quan Trọng Khi Chọn Ngày Cưới',
          content: 'Khi chọn ngày cưới, cần xem xét:',
          list: [
            'Tuổi của cô dâu và chú rể',
            'Mệnh của vợ chồng (Kim, Mộc, Thủy, Hỏa, Thổ)',
            'Tháng tốt, tháng xấu trong năm',
            'Ngày hoàng đạo theo lịch Việt',
            'Tránh tháng cô hồn, tháng phạm tuổi',
            'Giờ tốt để đón dâu, lễ thành hôn'
          ]
        },
        {
          heading: '3. Top 12 Ngày Cưới Tốt Năm 2026',
          content: 'Dựa trên lịch vạn niên năm Bính Ngọ 2026:',
          list: [
            'Ngày 18/01/2026 (CN Âm 19/12/2025): Ngày Hoàng Đạo, hợp mọi tuổi',
            'Ngày 25/02/2026 (DL Âm 28/01/2026): Ngày Thiên Đức, đại cát',
            'Ngày 15/03/2026 (CN Âm 16/02/2026): Ngày Tam Hợp, đại lợi',
            'Ngày 08/04/2026 (DL Âm 11/03/2026): Ngày Nguyệt Đức Hợp',
            'Ngày 12/05/2026 (DL Âm 16/04/2026): Ngày Hoàng Đạo Khai',
            'Ngày 20/06/2026 (CN Âm 26/05/2026): Ngày Thiên Ân',
            'Ngày 18/07/2026 (CN Âm 25/06/2026): Ngày Nguyệt Đức',
            'Ngày 15/08/2026 (CN Âm 23/07/2026): Ngày Hoàng Đạo',
            'Ngày 19/09/2026 (CN Âm 29/08/2026): Ngày Thiên Đức Hợp',
            'Ngày 10/10/2026 (CN Âm 20/09/2026): Ngày Tam Hợp',
            'Ngày 15/11/2026 (CN Âm 26/10/2026): Ngày Nguyệt Đức',
            'Ngày 12/12/2026 (CN Âm 24/11/2026): Ngày Hoàng Đạo'
          ]
        },
        {
          heading: '4. Giờ Tốt Đón Dâu, Lễ Thành Hôn',
          content: 'Các giờ hoàng đạo thường được chọn:',
          list: [
            'Giờ Tý (23h-1h): Hợp cưới tại nhà hàng',
            'Giờ Mão (5h-7h): Hợp đón dâu sáng sớm',
            'Giờ Tỵ (9h-11h): Hợp lễ cưới buổi sáng',
            'Giờ Ngọ (11h-13h): Hợp lễ cưới buổi trưa',
            'Giờ Dậu (17h-19h): Hợp tiệc cưới buổi tối'
          ]
        },
        {
          heading: '5. Lưu Ý Khi Chọn Ngày Cưới',
          content: 'Một số điều cần tránh:',
          list: [
            'Tránh tháng 3, 7 Âm lịch (tháng cô hồn)',
            'Tránh ngày mồng 1, 15 Âm lịch',
            'Tránh ngày Rằm, ngày Tết',
            'Tránh ngày phạm tuổi chủ hôn',
            'Không cưới vào năm vợ hoặc chồng phạm tuổi'
          ]
        }
      ],
      conclusion: 'Chọn ngày cưới tốt là bước quan trọng đầu tiên trên con đường xây dựng hạnh phúc gia đình. Tuy nhiên, yếu tố quan trọng nhất vẫn là tình yêu chân thành và sự nỗ lực của cả hai. Chúc các cặp đôi trăm năm hạnh phúc!'
    }
  },
  'huong-nha-tot-2026': {
    id: '5',
    title: 'Hướng Nhà Tốt Năm 2026: Xây Nhà Hướng Nào May Mắn?',
    excerpt: 'Phong thủy hướng nhà năm 2026. Hướng Đông, Tây, Nam, Bắc nào tốt cho tuổi chủ nhà? Cách chọn hướng cửa chính, hướng giường ngủ đón tài lộc.',
    date: '10/01/2026',
    readTime: '11 phút',
    category: 'Phong Thủy Nhà Ở',
    slug: 'huong-nha-tot-2026',
    keywords: ['hướng nhà tốt 2026', 'phong thủy hướng nhà', 'hướng cửa chính', 'xây nhà hướng nào tốt'],
    relatedPosts: ['phong-thuy-tet-2026', 'mau-sac-may-man-2026'],
    content: {
      intro: 'Hướng nhà là yếu tố phong thủy quan trọng nhất ảnh hưởng đến vận may của gia chủ. Chọn đúng hướng nhà sẽ giúp gia đình an khang, tài lộc, sự nghiệp phát triển. Năm 2026, đây là những hướng nhà tốt nhất theo phong thủy.',
      sections: [
        {
          heading: '1. Hướng Nhà Là Gì?',
          content: 'Hướng nhà là hướng cửa chính đón khí vào nhà. Xác định hướng nhà:',
          list: [
            'Đứng ở giữa nhà, quay mặt ra ngoài',
            'Hướng bạn quay mặt chính là hướng nhà',
            'Dùng la bàn để xác định chính xác',
            'Có 8 hướng chính: Đông, Tây, Nam, Bắc, Đông Bắc, Tây Bắc, Đông Nam, Tây Nam'
          ]
        },
        {
          heading: '2. Hướng Nhà Tốt Theo Mệnh Ngũ Hành',
          content: 'Mỗi mệnh có hướng nhà phù hợp riêng:',
          list: [
            'Mệnh Kim: Hướng Tây, Tây Bắc, Tây Nam (tương sinh)',
            'Mệnh Mộc: Hướng Đông, Đông Nam, Đông Bắc (tương sinh)',
            'Mệnh Thủy: Hướng Bắc, Tây Bắc, Đông Bắc (tương sinh)',
            'Mệnh Hỏa: Hướng Nam, Đông Nam, Tây Nam (tương sinh)',
            'Mệnh Thổ: Hướng Tây Nam, Đông Bắc, Nam (tương sinh)'
          ]
        },
        {
          heading: '3. Hướng Nhà Tốt Năm Bính Ngọ 2026',
          content: 'Theo Cửu Cung Phi Tinh, năm 2026:',
          list: [
            'Hướng Đông Nam: Ngôi sao Chính Tài bay vào, đại cát',
            'Hướng Tây Bắc: Ngôi sao Văn Xương, tốt cho học tập',
            'Hướng Bắc: Ngôi sao Chính Quan, tốt cho sự nghiệp',
            'Hướng Tây: Ngôi sao Lộc Tồn, tốt cho kinh doanh',
            'Tránh hướng Tây Nam: Sao Nhị Hắc (bệnh tật)'
          ]
        },
        {
          heading: '4. Cách Chọn Hướng Giường Ngủ',
          content: 'Hướng giường ngủ cũng rất quan trọng:',
          list: [
            'Đầu giường hướng Đông: Tốt cho sức khỏe, tuổi thọ',
            'Đầu giường hướng Tây: Tốt cho giấc ngủ ngon',
            'Đầu giường hướng Nam: Tốt cho sự nghiệp',
            'Đầu giường hướng Bắc: Tốt cho tài lộc',
            'Tránh đầu giường hướng cửa ra vào'
          ]
        },
        {
          heading: '5. Cách Hóa Giải Hướng Nhà Xấu',
          content: 'Nếu nhà đã xây hướng không tốt:',
          list: [
            'Đặt bàn thờ Thần Tài ở vị trí Chính Tài',
            'Treo gương Bát Quái ở cửa chính',
            'Đặt cây phong thủy hóa giải',
            'Thay đổi màu sơn nhà cho phù hợp',
            'Bố trí nội thất theo nguyên tắc phong thủy'
          ]
        }
      ],
      conclusion: 'Chọn hướng nhà tốt là nền tảng phong thủy quan trọng nhất. Nếu đã xây nhà hướng không phù hợp, đừng lo lắng quá, có nhiều cách hóa giải hiệu quả. Quan trọng nhất là giữ tâm hồn thanh thản, làm việc chăm chỉ và đối xử tốt với mọi người.'
    }
  },
  'tuoi-ty-nam-2026': {
    id: '6',
    title: 'Tuổi Tỵ (Rắn) Năm 2026: Phạm Tuổi Có Xui Xẻo Không?',
    excerpt: 'Tuổi Tỵ năm Bính Ngọ 2026 phạm tuổi, vận may ra sao? Cách hóa giải tuổi phạm: đeo vật phẩm gì, làm gì để may mắn, tránh tai họa.',
    date: '09/01/2026',
    readTime: '7 phút',
    category: 'Tử Vi',
    slug: 'tuoi-ty-nam-2026',
    keywords: ['tuổi tỵ 2026', 'tuổi phạm 2026', 'hóa giải tuổi phạm', 'tử vi tuổi rắn 2026'],
    relatedPosts: ['tu-vi-12-con-giap-2026', 'mau-sac-may-man-2026'],
    content: {
      intro: 'Năm Bính Ngọ 2026 là năm tuổi Tỵ (Rắn) phạm tuổi Thái Tuế. Nhiều người lo lắng về vận may và sức khỏe. Vậy tuổi phạm có thực sự xui xẻo? Cách nào để hóa giải?',
      sections: [
        {
          heading: '1. Tuổi Phạm Là Gì?',
          content: 'Tuổi phạm (hay phạm Thái Tuế) là:',
          list: [
            'Tuổi trùng với Can Chi của năm',
            'Ví dụ: Tuổi Tỵ gặp năm Bính Ngọ',
            'Theo tín ngưỡng dân gian, năm phạm tuổi có nhiều biến động',
            'Cần cẩn trọng trong công việc, tài chính, sức khỏe'
          ]
        },
        {
          heading: '2. Vận May Tuổi Tỵ Năm 2026',
          content: 'Dự đoán tổng quan:',
          list: [
            'Sự nghiệp: Có nhiều thay đổi, nên thận trọng',
            'Tài lộc: Không nên đầu tư lớn, giữ vốn an toàn',
            'Tình duyên: Dễ có khẩu thiệt, cần bao dung',
            'Sức khỏe: Chú ý tiêu hóa, gan mật',
            'Tổng quan: Năm cẩn trọng, không phải năm xấu'
          ]
        },
        {
          heading: '3. Cách Hóa Giải Tuổi Phạm',
          content: 'Các phương pháp hóa giải hiệu quả:',
          list: [
            'Đeo vòng tay phong thủy (thạch anh, mã não)',
            'Đeo dây chuyền 12 con giáp',
            'Cúng giải hạn đầu năm',
            'Làm từ thiện, phóng sinh',
            'Tránh tham gia đám tang, viếng người ốm'
          ]
        },
        {
          heading: '4. Những Điều Nên Làm Năm 2026',
          content: 'Để có một năm thuận lợi:',
          list: [
            'Giữ tâm trạng tích cực, lạc quan',
            'Làm việc chăm chỉ, đừng ỷ lại',
            'Đầu tư vào bản thân, học thêm kỹ năng',
            'Duy trì sức khỏe bằng thể dục, ăn uống khoa học',
            'Hòa thuận gia đình, thân thiện với đồng nghiệp'
          ]
        },
        {
          heading: '5. Những Điều Nên Tránh Năm 2026',
          content: 'Các việc không nên làm:',
          list: [
            'Đầu tư lớn, kinh doanh rủi ro cao',
            'Mua nhà, mua đất, xây dựng lớn',
            'Cãi vã, tranh chấp với người khác',
            'Đi lại xa về hướng xấu',
            'Tham gia cờ bạc, đầu cơ chứng khoán'
          ]
        }
      ],
      conclusion: 'Tuổi phạm không đáng sợ nếu bạn biết cách ứng xử đúng đắn. Giữ tâm trạng tích cực, làm việc chăm chỉ, sống tốt với mọi người - đó là cách hóa giải tuổi phạm hiệu quả nhất. Chúc tuổi Tỵ một năm 2026 bình an!'
    }
  },
  'mau-sac-may-man-2026': {
    id: '7',
    title: 'Màu Sắc May Mắn Năm 2026 Theo Mệnh Kim Mộc Thủy Hỏa Thổ',
    excerpt: 'Màu sắc hợp phong thủy năm 2026 cho từng mệnh. Mệnh Kim, Mộc, Thủy, Hỏa, Thổ nên mặc màu gì, sơn nhà màu gì để thu hút tài lộc?',
    date: '08/01/2026',
    readTime: '8 phút',
    category: 'Phong Thủy',
    slug: 'mau-sac-may-man-2026',
    keywords: ['màu sắc may mắn 2026', 'màu sắc phong thủy', 'màu hợp mệnh', 'màu sơn nhà 2026'],
    relatedPosts: ['huong-nha-tot-2026', 'phong-thuy-tet-2026'],
    content: {
      intro: 'Màu sắc trong phong thủy có ảnh hưởng lớn đến vận may, tâm trạng và năng lượng của con người. Chọn đúng màu sắc phù hợp với mệnh sẽ giúp bạn thu hút tài lộc, may mắn trong năm 2026.',
      sections: [
        {
          heading: '1. Ngũ Hành Và Màu Sắc',
          content: 'Mỗi mệnh ngũ hành có màu sắc tương ứng:',
          list: [
            'Mệnh Kim: Màu trắng, vàng, bạc, kim loại',
            'Mệnh Mộc: Màu xanh lá, xanh lơ, xanh ngọc',
            'Mệnh Thủy: Màu đen, xanh đậm, xanh navy',
            'Mệnh Hỏa: Màu đỏ, cam, hồng, tím',
            'Mệnh Thổ: Màu vàng, nâu, be, cam đất'
          ]
        },
        {
          heading: '2. Màu Sắc May Mắn Năm Bính Ngọ 2026',
          content: 'Năm 2026 là năm Bính Ngọ (Mộc Thổ), màu may mắn:',
          list: [
            'Màu chủ đạo: Xanh lá, vàng, nâu đất',
            'Màu phụ: Đỏ, cam, hồng (Hỏa sinh Thổ)',
            'Màu nên tránh: Trắng, xám (Kim khắc Mộc)',
            'Màu trung tính: Kem, be, nâu nhạt'
          ]
        },
        {
          heading: '3. Màu Tốt Cho Từng Mệnh Năm 2026',
          content: 'Màu sắc phù hợp cho từng mệnh:',
          list: [
            'Mệnh Kim: Vàng, nâu, đỏ (Hỏa Thổ sinh Kim)',
            'Mệnh Mộc: Xanh lá, xanh lơ, đen (Thủy sinh Mộc)',
            'Mệnh Thủy: Trắng, xám, đen (Kim sinh Thủy)',
            'Mệnh Hỏa: Xanh lá, đỏ, tím (Mộc sinh Hỏa)',
            'Mệnh Thổ: Đỏ, vàng, nâu (Hỏa sinh Thổ)'
          ]
        },
        {
          heading: '4. Ứng Dụng Màu Sắc Trong Cuộc Sống',
          content: 'Cách sử dụng màu sắc hiệu quả:',
          list: [
            'Quần áo: Mặc màu hợp mệnh khi đi làm, gặp đối tác',
            'Sơn nhà: Chọn màu sơn phòng khách, phòng ngủ phù hợp',
            'Xe hơi: Chọn màu xe hợp mệnh chủ xe',
            'Phụ kiện: Ví, túi xách, điện thoại màu hợp mệnh',
            'Nội thất: Sofa, rèm cửa, thảm trải màu hài hòa'
          ]
        },
        {
          heading: '5. Lưu Ý Khi Chọn Màu Sắc',
          content: 'Một số điều cần chú ý:',
          list: [
            'Không nên dùng quá nhiều màu xung khắc',
            'Kết hợp màu chủ đạo với màu phụ hài hòa',
            'Tránh màu quá sặc sỡ, chói mắt',
            'Ưu tiên màu tự nhiên, dễ chịu',
            'Điều chỉnh theo sở thích cá nhân'
          ]
        }
      ],
      conclusion: 'Màu sắc phong thủy là công cụ hỗ trợ đắc lực để cải thiện vận may. Tuy nhiên, đừng quá phụ thuộc vào màu sắc mà quên mất nỗ lực bản thân. Kết hợp khéo léo giữa phong thủy và hành động thực tế sẽ mang lại thành công bền vững!'
    }
  }
  // Các bài viết đã hoàn thiện
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const post = slug ? blogPostsData[slug] : null

  useEffect(() => {
    if (!post) {
      navigate('/blog')
      return
    }

    document.title = `${post.title} | Thầy Tám Phong Thủy`
    
    const metaTags = [
      { name: 'description', content: post.excerpt },
      { name: 'keywords', content: post.keywords.join(', ') },
      { property: 'og:title', content: post.title },
      { property: 'og:description', content: post.excerpt },
      { property: 'og:type', content: 'article' }
    ]

    metaTags.forEach(({ name, property, content }) => {
      const attr = name ? 'name' : 'property'
      const value = name || property || ''
      let meta = document.querySelector(`meta[${attr}="${value}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, value)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })

    // Scroll to top
    window.scrollTo(0, 0)
  }, [post, navigate])

  if (!post) {
    return null
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
    } else {
      // Copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Đã copy link bài viết!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-purple-600">Trang chủ</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-purple-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-900">{post.category}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Bài viết chuyên sâu</span>
            </div>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <Share2 className="w-5 h-5" />
              <span>Chia sẻ</span>
            </button>
          </div>

          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              {post.content.intro}
            </p>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none space-y-8">
            {post.content.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="space-y-3">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-purple-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-12 p-6 bg-purple-50 rounded-xl border-l-4 border-purple-600">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              💫 Kết Luận
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại Blog</span>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Muốn Tư Vấn Cá Nhân Hóa?
          </h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Chat với Thầy Tám AI để nhận tư vấn phong thủy, xem ngày tốt và tử vi 
            riêng dành cho bạn dựa trên ngày giờ sinh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Chat ngay
            </Link>
            <Link
              to="/register"
              className="bg-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-400 transition"
            >
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
