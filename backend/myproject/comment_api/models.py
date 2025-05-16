#api de comentarios ojala funcione
from django.db import models

class Comment(models.Model):
    text = models.TextField()
    image = models.ImageField(upload_to='comment_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text[:30] + ('...' if len(self.text) > 30 else '')
