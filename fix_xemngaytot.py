import re

# Read file
with open('src/pages/XemNgayTot.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Replace imports
content = content.replace(
    "import { callGeminiAPI } from '../lib/gemini'",
    "import { findGoodDates, type GoodDate } from '../lib/lichPhongThuyCalculator'"
)

# Fix 2: Remove GoodDate interface (now imported)
content = re.sub(
    r'interface GoodDate \{[^}]+\}',
    '',
    content,
    flags=re.DOTALL
)

# Fix 3: Replace handleSubmit function - find the entire function
old_submit = re.search(
    r'async function handleSubmit\(e: React\.FormEvent\) \{.*?^  \}',
    content,
    flags=re.DOTALL | re.MULTILINE
)

if old_submit:
    new_submit = '''async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Auto-save user info to profile
      if (user && updateUserInfo && (userName || birthYear)) {
        await updateUserInfo({
          name: userName || user.name,
        })
      }

      // Parse dates
      const start = new Date(dateFrom)
      const end = new Date(dateTo)
      
      // Validate dates
      if (start > end) {
        setError('Ngày bắt đầu phải trước ngày kết thúc')
        return
      }
      
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff > 90) {
        setError('Chỉ có thể xem tối đa 90 ngày')
        return
      }

      // Use Can Chi calculator - NO AI, instant results
      const year = birthYear ? parseInt(birthYear) : undefined
      const goodDates = findGoodDates(start, end, purpose, year)
      
      if (goodDates.length > 0) {
        setResults(goodDates)
        setStep('result')
      } else {
        setError('Không tìm thấy ngày phù hợp trong khoảng thời gian này. Vui lòng thử khoảng thời gian khác hoặc mục đích khác.')
      }
    } catch (err: any) {
      console.error('XemNgayTot error:', err)
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }'''
    
    content = content[:old_submit.start()] + new_submit + content[old_submit.end():]

# Fix 4: Remove parseGeminiResponse function
content = re.sub(
    r'function parseGeminiResponse\(text: string\): GoodDate\[\] \{.*?^  \}',
    '',
    content,
    flags=re.DOTALL | re.MULTILINE
)

# Write back
with open('src/pages/XemNgayTot.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed XemNgayTot.tsx")
