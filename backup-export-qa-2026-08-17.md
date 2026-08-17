# Backup Export & Transfer Center QA Report — 2026-08-17

## 1. Scope & Implementation
- **Owner Workspace Integration:** Добавлен новый маршрут `/backup` и иконка в боковое меню администратора (DashboardLayout).
- **Security:** Добавлена проверка `ownerProcedure`, разрешающая доступ и экспорт только владельцу медиа-кита (`ENV.ownerOpenId`).
- **Portable JSON Package:** Создан модуль `shared/backup.ts`, формирующий стандартизированный архив с версией схемы (`1.0.0`), манифестом проекта, статическим мультиязычным контентом (`Home.tsx`), соцсетями, Instagram snapshot, таблицами базы данных (`users`, `testimonials`, `collaborations`, `analytics`) и готовой инструкцией восстановления (migration manifest, activation prompt).
- **Secret & PII Exclusion:** Исключены секреты среды (`DATABASE_URL`, `JWT_SECRET`, ключи API) и заблаговременно удалены/замаскированы чувствительные идентификаторы (`openId`, `ipHash`, `sessionId`).

## 2. Performance & Chunked Export
- **Initial Summary:** Открытие `/backup` запрашивает быстрый `summary` (коллекции counts), что позволяет мгновенно отрисовать состав базы данных без зависаний.
- **Paginated Analytics Export:** Полный экспорт базы данных разделен на базовый `core` snapshot и порционное чтение `analyticsChunk` по 5,000 событий. Во время экспорта интерфейс отображает живой прогресс в элементах с `aria-live="polite"`, позволяя успешно экспортировать более 276,000 событий без падений по памяти и таймаутов.

## 3. Verification & Testing
- **Vitest Coverage:** 27 юнит-тестов успешно пройдены (`server/backup.test.ts`, `server/collaborations.test.ts`, `server/testimonials.test.ts`, и др.).
- **Production Build:** Успешная сборка Vite + esbuild.
- **Browser QA:** Проверена работа в owner workspace с успешным скачиванием JSON-файла и появлением всплывающего уведомления («Backup-пакет скачан»).

## Import QA — owner preview

В owner preview `/backup` загружен JSON fixture через видимый `label`/file input. UI показал toast «Backup проверен — можно начать восстановление», имя файла, schema version `1.0.0`, дату экспорта, режим `merge-by-id` и counts: 0 testimonials, 0 collaborations, 0 analytics, 2 languages. После безопасного empty restore (без записей для вставки) UI показал toast «Восстановлено: 0 отзывов, 0 коллабораций, 0 analytics событий», а кнопка вернулась в активное состояние. Это подтверждает upload, server validation, preview и confirmation state; реальные данные не изменялись.

## Server preview diff QA

После обновления server-computed preview diff Backup Center снова открылся в owner session. Summary отобразил актуальные counts: 1 user, 15 testimonials, 0 collaborations, 276,249 analytics events; доступен блок «Восстановить из JSON». Upload/preview fixture ранее подтвердил schema/version, merge-by-id и server validation; diff UI добавлен для показа insert/update перед confirmation.

## Import diff live progress

В owner Backup Center после повторной загрузки fixture label переключился на «Сравниваем с текущей базой…», а aria-live текст показал «Сравниваем записи с текущей базой…». Это подтверждает отдельный server-computed preview этап перед отображением кнопки подтверждения.

## Final import diff preview

Server-computed diff завершился успешно. Для empty fixture UI показал: testimonials `+0 / update 0`, collaborations `+0 / update 0`, analytics `+0 / skip 0`. Toast подтвердил «Backup проверен — можно начать восстановление», а confirmation action осталась доступной. Этот QA-проход не изменял реальные записи.
