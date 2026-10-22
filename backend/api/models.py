# api 应用不再单独定义模型。
# Todo 模型统一放在 todo/models.py 中，避免出现两张同名表（todo_todo 与 api_todo），
# 否则 API 写入的表和 Django 后台管理的表会不一致（之前“后台看不到 API 新增的任务”就是这个原因）。
