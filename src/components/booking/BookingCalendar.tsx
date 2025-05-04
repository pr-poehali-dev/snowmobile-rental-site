
import { useState, useEffect } from 'react';
import { addDays, format, isAfter, isBefore, isWithinInterval, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { bookingApi, Booking } from '@/lib/api';
import { Snowmobile } from '@/types/snowmobile';

interface BookingCalendarProps {
  snowmobile: Snowmobile;
  onDateSelect: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const BookingCalendar = ({ snowmobile, onDateSelect }: BookingCalendarProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [bookedDates, setBookedDates] = useState<{start: Date; end: Date}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Получение занятых дат
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setIsLoading(true);
        // Здесь должен быть запрос к API для получения занятых дат
        // В демо-режиме создаем некоторые занятые даты
        if (import.meta.env.DEV) {
          // Демо-данные для разработки
          const today = new Date();
          const mockBookedIntervals = [
            { start: addDays(today, 2), end: addDays(today, 4) },
            { start: addDays(today, 10), end: addDays(today, 12) },
            { start: addDays(today, 20), end: addDays(today, 25) },
          ];
          setBookedDates(mockBookedIntervals);
        } else {
          // В реальном приложении здесь будет запрос к API
          const result = await bookingApi.getBookedDates(snowmobile.id);
          setBookedDates(result);
        }
      } catch (error) {
        console.error('Failed to fetch booked dates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedDates();
  }, [snowmobile.id]);

  // Функция для определения, доступна ли дата для выбора
  const isDateDisabled = (date: Date) => {
    // Запрещаем даты до сегодня
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }
    
    // Проверяем, не попадает ли дата в промежуток занятых дат
    return bookedDates.some(interval => 
      isWithinInterval(date, { start: interval.start, end: interval.end })
    );
  };

  // Обработчик выбора даты
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!startDate || (startDate && endDate)) {
      // Если не выбрана начальная дата или выбраны обе даты, то устанавливаем начальную
      setStartDate(date);
      setEndDate(undefined);
    } else {
      // Иначе выбираем конечную дату, но только если она после начальной
      if (isAfter(date, startDate)) {
        // Проверяем, что между начальной и конечной датой нет занятых дат
        const isRangeAvailable = !bookedDates.some(interval => 
          (isAfter(interval.start, startDate) && isBefore(interval.start, date)) ||
          (isAfter(interval.end, startDate) && isBefore(interval.end, date))
        );
        
        if (isRangeAvailable) {
          setEndDate(date);
          onDateSelect(startDate, date);
        } else {
          // Если есть пересечения, сбрасываем выбор
          setStartDate(date);
          setEndDate(undefined);
          onDateSelect(date, undefined);
        }
      } else {
        // Если выбранная дата раньше начальной, обновляем начальную
        setStartDate(date);
        setEndDate(undefined);
        onDateSelect(date, undefined);
      }
    }
  };

  // Стилизация выбранного диапазона дат
  const dateClassName = (date: Date) => {
    const isStart = startDate && date.getTime() === startDate.getTime();
    const isEnd = endDate && date.getTime() === endDate.getTime();
    const isInRange = startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate });
    
    return isStart && isEnd 
      ? 'bg-primary text-primary-foreground rounded-full font-bold' 
      : isStart 
        ? 'bg-primary text-primary-foreground rounded-l-full font-bold' 
        : isEnd 
          ? 'bg-primary text-primary-foreground rounded-r-full font-bold' 
          : isInRange 
            ? 'bg-primary-light text-primary-foreground' 
            : '';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" className="text-primary h-4 w-4" />
            <h3 className="font-medium">Выберите даты аренды</h3>
          </div>
          <p className="text-sm text-gray-500">
            Сначала выберите дату начала, затем дату окончания аренды
          </p>
        </div>
        
        {/* Отображение выбранных дат */}
        {startDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Начало:</span>{' '}
                <Badge variant="outline" className="ml-1 font-medium">
                  {format(startDate, 'dd MMMM yyyy', { locale: ru })}
                </Badge>
              </div>
              {endDate && (
                <div>
                  <span className="text-gray-500">Окончание:</span>{' '}
                  <Badge variant="outline" className="ml-1 font-medium">
                    {format(endDate, 'dd MMMM yyyy', { locale: ru })}
                  </Badge>
                </div>
              )}
            </div>
            {startDate && endDate && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-500">Продолжительность:</span>{' '}
                <span className="font-medium">
                  {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} дней
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Календарь */}
        <div className="border rounded-md p-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              <span>Загрузка календаря...</span>
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              modifiers={{
                booked: bookedDates.flatMap(interval => 
                  [...Array(
                    Math.ceil((interval.end.getTime() - interval.start.getTime()) / (1000 * 60 * 60 * 24))
                  )].map((_, i) => addDays(interval.start, i))
                )
              }}
              modifiersClassNames={{
                booked: "bg-red-100 text-red-800 opacity-60"
              }}
              className="rounded-md border-0"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                day_range_end: "bg-primary text-primary-foreground rounded-r-full",
                day_range_start: "bg-primary text-primary-foreground rounded-l-full",
                day_range_middle: "bg-primary-light text-primary-foreground"
              }}
              components={{
                DayContent: ({ date }) => (
                  <div className={dateClassName(date)}>
                    {date.getDate()}
                  </div>
                ),
              }}
              fromDate={new Date()}
              fixedWeeks
              locale={ru}
            />
          )}
        </div>
        
        {/* Легенда */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span>Выбранная дата</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
            <span>Занято</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-light mr-2"></div>
            <span>Диапазон дат</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCalendar;
