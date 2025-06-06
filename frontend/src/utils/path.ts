type RootPage = '';

type ManagePage = 'manage';

type ManageDownPages = 'crags' | 'dashborad' | 'users' | 'new-crag' | 'tags' | 'notices' | 'contributions';

type ManageCragsPage = Extract<ManageDownPages, 'crags'>;

type Urls =
  | `/${RootPage}`
  | `/${ManagePage}`
  | `/${ManagePage}/${ManageDownPages}`
  | `/${ManagePage}/${ManageCragsPage}/:id`;

class UrlService {
  getRelativePath(url: Urls) {
    return url.split('/').pop() || '';
  }

  getAbsolutePath(url: Urls) {
    return url;
  }
}

export const urlService = new UrlService();
