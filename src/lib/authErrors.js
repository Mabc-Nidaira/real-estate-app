// Supabase 認証のエラーを、画面に表示する日本語に変換する
// 判定は英語の文言ではなく、Supabase のエラーコード(error.code)で行う
// エラーコード一覧: https://supabase.com/docs/guides/auth/debugging/error-codes
const MESSAGES = {
  invalid_credentials: 'メールアドレスまたはパスワードが正しくありません。',
  email_not_confirmed:
    'メールアドレスの確認が完了していません。届いた確認メールのリンクを開いてください。',
  user_already_exists: 'このメールアドレスはすでに登録されています。ログインしてください。',
  email_exists: 'このメールアドレスはすでに登録されています。ログインしてください。',
  email_address_invalid: 'このメールアドレスは登録に使用できません。別のメールアドレスをお試しください。',
  email_address_not_authorized:
    'このメールアドレスにはメールを送信できない設定になっています。管理者にお問い合わせください。',
  signup_disabled: '現在、新規の会員登録を受け付けていません。',
  email_provider_disabled: '現在、メールアドレスでの登録・ログインは利用できません。',
  over_email_send_rate_limit:
    'メールの送信回数が上限に達しました。しばらく待ってからもう一度お試しください。',
  over_request_rate_limit:
    '短時間に操作が集中しました。しばらく待ってからもう一度お試しください。',
  unexpected_failure: 'サーバーでエラーが発生しました。管理者にお問い合わせください。',
}

// パスワードが弱いと判定された理由ごとのメッセージ
const WEAK_PASSWORD_MESSAGES = {
  length: 'パスワードが短すぎます。',
  characters: 'パスワードに使う文字の種類が足りません(英大文字・英小文字・数字・記号などを組み合わせてください)。',
  pwned: 'このパスワードは過去に流出したことがあり、安全ではありません。別のパスワードにしてください。',
}

export function toJapaneseAuthError(error) {
  const code = error?.code
  const message = error?.message ?? ''

  // パスワードが弱い場合は、理由に合わせて説明する
  if (code === 'weak_password') {
    const reasons = error.reasons ?? []
    const details = reasons.map((r) => WEAK_PASSWORD_MESSAGES[r]).filter(Boolean)
    return details.length > 0 ? details.join('') : 'パスワードが弱すぎます。別のパスワードにしてください。'
  }

  if (code && MESSAGES[code]) {
    return MESSAGES[code]
  }

  // 入力値のチェックで弾かれた場合(メールアドレスの形式など)
  if (code === 'validation_failed' && message.includes('email')) {
    return 'メールアドレスの形式が正しくありません。'
  }

  // ネットワークに接続できない場合
  if (error?.name === 'AuthRetryableFetchError' || message.includes('Failed to fetch')) {
    return 'サーバーに接続できませんでした。通信環境を確認してもう一度お試しください。'
  }

  // 想定外のエラーは、原因を調べられるようにエラーコードを添えて表示する
  // (詳細はブラウザの開発者ツールのコンソールに出力する)
  console.error('認証エラー:', { code, status: error?.status, message })
  const hint = code ?? error?.status
  return `エラーが発生しました。時間をおいてもう一度お試しください。${hint ? `(エラーコード: ${hint})` : ''}`
}
