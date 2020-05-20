import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RiskMatrixPage } from './risk-matrix.page';

const routes: Routes = [
  {
    path: '',
    component: RiskMatrixPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RiskMatrixPage]
})
export class RiskMatrixPageModule {

  "ZAxisOptions": [
    {
      "value": string,
      "Weighting": 1
    }
  ];
  "matrix_Y": number;
  "RankLegend": [
    {
      "Des": string,
      "Rank": string,
      "Color": string
    }
  ];
  "YAxisOptions": [
    {
      "value": string,
      "Weighting": number
    }
  ];
  "XAxisOptions": [
    {
      "value": string,
      "Weighting": number
    }
  ];
  "XAxisLabel": string;
  "FactorsNum": string;
  "ZAxisLabel": string;
  "RMTable": {
    "r": [
      {
        "Score": number,
        "Des": string,
        "Rank": string,
        "Color": string
      }
    ]

  };
  "TemplateTitle": string;
  "YAxisLabel": string;
  "CalculationMethod": string;
  "matrix_X": number
};



