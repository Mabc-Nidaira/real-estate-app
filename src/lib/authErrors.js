// Supabase のエラーメッセージ(英語)を、画面に表示する日本語に変換する
export function toJapaneseAuthError(error) {
  const message = error?.message ?? ''

  if (message.includes('Invalid login credentials')) {
    return 'メールアドレスまたはパスワードが正しくありません。'
  }
  if (message.includes('Email not confirmed')) {
    return 'メールアドレスの確認が完了していません。届いた確認メールのリンクを開いてください。'
  }
  if (message.includes('User already registered')) {
    return 'このメールアドレスはすでに登録されています。'
  }
  if (message.includes('Password should be at least')) {
    return 'パスワードは6文字以上で入力してください。'
  }
  if (message.includes('Unable to validate email address')) {
    return 'メールアドレスの形式が正しくありません。'
  }
  if (message.toLowerCase().includes('rate limit')) {
    return '短時間に操作が集中しました。しばらく待ってからもう一度お試しください。'
  }
  return 'エラーが発生しました。時間をおいてもう一度お試しください。'
}
