from django.db import migrations


class Migration(migrations.Migration):
    """把历史上重复定义的 api.Todo 模型从迁移状态中移除（只改状态，不删表）。

    api_todo 表里的旧数据仍然保留，不会被删除；但代码中只保留 todo.Todo 这一份模型。
    """

    dependencies = [
        ('api', '0006_initial'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.DeleteModel(name='Todo'),
            ],
        ),
    ]
