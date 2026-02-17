import logging
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import PendingUser

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Delete expired PendingUser entries'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show count without deleting')

    def handle(self, *args, **options):
        now = timezone.now()
        qs = PendingUser.objects.filter(expires_at__lt=now)
        count = qs.count()
        if options['dry_run']:
            self.stdout.write(self.style.WARNING(f'Would delete {count} expired pending users'))
            return
        deleted, _ = qs.delete()
        logger.info('Deleted %d expired PendingUser entries', deleted)
        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted} expired pending users'))
