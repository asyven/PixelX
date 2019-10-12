# PixelX

PixelX - бот, позволяющий автоматически играть в PixelBattle 2019 ВКонтакте с нескольких ссылок.

[![Группа ВКонтакте](https://img.shields.io/badge/Группа-ВКонтакте-yellow.svg)](https://vk.com/aeonix)
[![Канал Telegram](https://img.shields.io/badge/Канал-Telegram-yellow.svg)](https://t.me/aeonixlegitistyping)
[![Донат разработчику](https://img.shields.io/badge/Поддержать-разработчика-orange.svg)](https://qiwi.com/n/aeonix)

## Установка

1) Для начала надо установить в систему [Node.JS версии 8 или выше](https://nodejs.org/) (установщик для **Windows** - [Node.js v10.16.3 LTS](https://nodejs.org/dist/v10.16.3/node-v10.16.3-x64.msi)), без этого бот просто не сможет работать.

2) После скачивания и установки Node.JS, скачиваем самого бота нажав на [эту ссылку](https://github.com/aeonixlegit/PixelX/archive/master.zip).

3) Распаковываем скачанный архив с файлами бота в *любую* папку и заходим в неё.

4) Устанавливаем необходимые для бота файлы, для этого просто откройте файл `install` формата `.bat` для Windows или `.sh` для Linux, дождитесь закрытия окна и переходите к следующему пункту.

5) Переходим к настройке бота.

## Настройка бота

1) Заходим во ВКонтакте, после чего открываем код элемента (Ctrl + Shift + I / F12), переходим во вкладку 'Network'.

2) Заходим в Pixel Battle и во вкладке Network ставим фильтр на 'WS', или ищем запрос со статусом 101, начинающийся на ws://.

3) Копируем данную ссылку в config.json (wssLinks), повторяем для всех аккаунтов.

4) Создаем изображение 1590x400 с прозрачным фоном и на нужных нам координатах размещаем необходимую картинку - пример изображения приведен в config.json.

5) Загружаем картинку на любой хостинг изображений и вставляем ссылку в config.json (image).

6) Запускаем бота.

## Запуск бота

1) Запускаем файл `start` формата `.bat` для Windows или `.sh` для Linux.

2) Радуемся жизни.

## Вклад в разработку

Вы можете привнести что-либо в разработку проекта, отправив Pull Request.

## Оригинальный разработчик

Оригинальным разработчиком является KotRikD - https://github.com/KotRikD
