import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'authemail', pathMatch: 'full' },
  {
    path: 'tabs',
    loadChildren: () => import('./portal/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'account', loadChildren: './setup/account/account.module#AccountPageModule' },
  { path: 'password', loadChildren: './setup/password/password.module#PasswordPageModule' },
  { path: 'offline', loadChildren: './setup/offline/offline.module#OfflinePageModule' },
  { path: 'language', loadChildren: './setup/language/language.module#LanguagePageModule' },
  { path: 'loginpass', loadChildren: './login/loginpass/loginpass.module#LoginpassPageModule' },
  { path: 'authemail', loadChildren: './login/authemail/authemail.module#AuthemailPageModule' },
  { path: 'form-list', loadChildren: './portal/form-list/form-list.module#FormListPageModule' },
  { path: 'new-form', loadChildren: './portal/new-form/new-form.module#NewFormPageModule' },
  { path: 'action', loadChildren: './portal/action/action.module#ActionPageModule' },
  { path: 'add-action', loadChildren: './portal/add-action/add-action.module#AddActionPageModule' },
  { path: 'sanner', loadChildren: './portal/sanner/sanner.module#SannerPageModule' },
  { path: 'risk-matrix', loadChildren: './portal/risk-matrix/risk-matrix.module#RiskMatrixPageModule' },  { path: 'subformlist', loadChildren: './portal/subformlist/subformlist.module#SubformlistPageModule' },





];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash:true,preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
