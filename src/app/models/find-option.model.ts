import { Between, FindManyOptions } from 'typeorm';
import { formatDate } from '@angular/common';

export class FindOption {
    constructor() { }

    static Desc() {
      const option: FindManyOptions = {
        order: {
          dataTimestamp: 'DESC'
        },
      };
      return option;
    }

    static TimestampDataByDate(date: Date) {
      const option: FindManyOptions = {
        where: {
          dataTimestamp: Between(new Date(date).setHours(0, 0, 0, 0),
            new Date(date).setHours(23, 59, 59, 999))
        }
      };
      return option;
    }

    static DailyDataByDate(date: Date) {
      const option: FindManyOptions = {
        where: {
          dateString: formatDate(date, 'yyyy-MM-dd', 'en-US')
        }
      };
      return option;
    }

    static LatestOne() {
      const option: FindManyOptions = {
        order: {
          dataTimestamp: 'DESC'
        },
        take: 1,
      };
      return option;
    }

    static SleepActivity(date: Date) {
      const option: FindManyOptions = {
        where: {
          dataTimestamp: Between(
            date.getTime() - 86400 * 1000,
            new Date(date).setHours(23, 59, 59, 999))
        }
      };
      return option;
    }

    static UnsentMeta() {
      const now = new Date();
      const today = formatDate(now, 'yyyy-MM-dd', 'en-US');
      const lastMonth = formatDate((now.getTime() - 86400 * 1000 * 30), 'yyyy-MM-dd', 'en-US');
      const option: FindManyOptions = {
        where: {
          hasSentData: 0,
          dateString: Between(lastMonth, today)
        }
      };
      return option;
    }
}
