import { AutoSaveTextField } from '@/components/molecules/AutoSaveTextField';
import { Calendar } from '@/components/molecules/Calendar';
import { CalendarMonthController } from '@/components/molecules/CalendarMonthController';
import { CragIcon } from '@/components/molecules/CragIcon';
import { CragInteriorPreview } from '@/components/molecules/CragInteriorPreview';
import { CragList } from '@/components/molecules/CragList';
import { CragListItem } from '@/components/molecules/CragListItem';
import { DatePicker } from '@/components/molecules/DatePicker';
import { EdgeIndicators } from '@/components/molecules/EdgeIndicators';
import { ExpeditionDate } from '@/components/molecules/ExpeditionDate';
import { FakeSearhInput } from '@/components/molecules/FakeSearhInput';
import { FilterTrigger } from '@/components/molecules/FilterTrigger';
import { GpsButton } from '@/components/molecules/GpsButton';
import { ImageWithSource } from '@/components/molecules/ImageWithSource';
import { LogoText } from '@/components/molecules/LogoText';
import { Map } from '@/components/molecules/Map';
import { MapOptions } from '@/components/molecules/MapOptions';
import { MenuTrigger } from '@/components/molecules/MenuTrigger';
import { NoticeList } from '@/components/molecules/NoticeList';
import { NoticeListItem } from '@/components/molecules/NoticeListItem';
import { NoticeMarquee } from '@/components/molecules/NoticeMarquee';
import { NoticeModalTrigger } from '@/components/molecules/NoticeModalTrigger';
import { SearchAndLoading } from '@/components/molecules/SearchAndLoading';
import { SearchInputWithRemove } from '@/components/molecules/SearchInputWithRemove';
import { SortOptionSelector } from '@/components/molecules/SortOptionSelector';
import { Story } from '@/components/molecules/Story';
import { TagList } from '@/components/molecules/TagList';
import { UserMenu } from '@/components/molecules/UserMenu';
import { UserProfile } from '@/components/molecules/UserProfile';

export const Molecules = {
  MenuTrigger,
  FilterTrigger,

  SearchAndLoading,
  ExpeditionDate,
  FakeSearhInput,
  SearchInputWithRemove,
  SortOptionSelector,
  DatePicker,

  CragList,
  CragListItem,
  CragInteriorPreview,
  CragIcon,

  TagList,

  GpsButton,
  MapOptions,

  UserMenu,
  UserProfile,

  NoticeModalTrigger,
  NoticeList,
  NoticeListItem,
  NoticeMarquee,

  Calendar,
  CalendarMonthController,

  ImageWithSource,

  Story,

  Map,

  EdgeIndicators,

  LogoText,

  /**
   * 백오피스 전용
   */
  AutoSaveTextField,
};
