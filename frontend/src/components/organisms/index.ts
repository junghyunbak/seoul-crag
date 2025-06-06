import { CalendarStory } from '@/components/organisms/CalendarStory';
import { CragDetail } from '@/components/organisms/CragDetail';
import { FilterButtonSheet } from '@/components/organisms/FilterBottomSheet';
import { ImageStory } from '@/components/organisms/ImageStory';
import { MapControlBar } from '@/components/organisms/MapControlBar';
import { MapControlFooter } from '@/components/organisms/MapControlFooter';
import { Notice } from '@/components/organisms/Notice';
import { OperationStory } from '@/components/organisms/OperationStory';
import { ProfileBottomSheet } from '@/components/organisms/ProfileBottomSheet';
import { Search } from '@/components/organisms/Search';
import { ShowerStory } from '@/components/organisms/ShowerStory';
import { Sidebar } from '@/components/organisms/Sidebar';
import { CragEdgeIndicators } from '@/components/organisms/CragEdgeIndicators';
import { GpsEdgeIndicators } from '@/components/organisms/GpsEdgeIndicators';
import { ManageSidebar } from '@/components/organisms/ManageSidebar';
import { ManageTopbar } from '@/components/organisms/ManageTopbar';
import { CragForm } from '@/components/organisms/CragForm';

export const Organisms = {
  MapControlBar,
  MapControlFooter,
  Search,
  FilterButtonSheet,
  Sidebar,
  Notice,
  ProfileBottomSheet,

  CalendarStory,
  OperationStory,
  ShowerStory,
  ImageStory,

  CragDetail,
  CragEdgeIndicators,

  GpsEdgeIndicators,

  /**
   * 관리 페이지 전용
   */
  ManageSidebar,
  ManageTopbar,

  CragForm,
};
