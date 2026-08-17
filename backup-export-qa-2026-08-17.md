# Backup Export QA — 2026-08-17

В owner workspace открыт `/backup`. Проверено, что initial page load показывает summary без ожидания полного analytics export: 1 user, 15 testimonials, 0 managed collaborations и 276,206 analytics events на момент проверки. Кнопка полного JSON backup активна только после получения summary.

После нажатия **Скачать полный backup** UI показывает loading state и live progress: «Получаем основное содержимое…», затем «Analytics: 5 000 событий», «15 000», «25 000» и «40 000» событий. Это подтверждает, что большой analytics snapshot запрашивается порциями по 5,000 событий, а не одним блокирующим запросом. Пакет исключает runtime secrets и redacts `users.openId`, `analytics.ipHash`, `analytics.sessionId`.

Повторная проверка показала дальнейшее продвижение export без блокировки интерфейса: 60,000 и 70,000 analytics events. Кнопка остаётся в loading state, progress text обновляется через `aria-live`, а summary counts остаются видимыми справа.

Продолжение live QA: chunk export достиг 90,000, 100,000, 110,000, 120,000 и 130,000 analytics events. Loading feedback остаётся видимым, summary counts не исчезают, а UI не блокирует просмотр инструкций.

Проверка продолжена до 180,000 analytics events. Порционный export продолжает работать без ошибки; прогресс обновляется каждые 5,000 событий.

Live QA достиг 195,000, 200,000, 210,000, 215,000 и 230,000 событий. Export продолжает последовательно читать chunks; UI остаётся responsive и явно сообщает текущий объём.

Финальная проверка завершена: export дошёл до всех 276,206 analytics events, вернулся к готовому состоянию, показал toast «Backup-пакет скачан» и снова активировал кнопку. В preview `chrome://downloads` не требовался для подтверждения UX: success toast и восстановление состояния видны в owner UI.
