import { animate, state, style, query, transition, trigger, animateChild } from '@angular/animations';

export const header_animation =
	trigger('trigger_header', [
		state('oscuro', style({
		  color: '#FFF',
		  backgroundColor: '#44318D',
		  opacity: '0.98'
		})),
		state('transparente',   style({ })),

	    transition(
			':enter', [
			  style({ transform: 'translateY(100%)', 'opacity': 0}),
			  animate('0.3s', style({transform: 'translateY(0)', 'opacity': 1}))
			]
		),
		transition(
			':leave', [
			  style({ transform: 'translateY(0)', 'opacity': 1}),
			  animate('0.3s', style({transform: 'translateY(-100%)', 'opacity': 0}))
			  
			]
		),
		transition('oscuro => transparente', animate('.3s 50ms ease-in')),
		transition('transparente => oscuro', animate('.3s 50ms ease-out'))
	]); 

export const logo_animation =
	trigger('trigger_logo', [
	    transition(
			':enter', [
			  style({'opacity': 0}),
			  animate('0.3s', style({'opacity': 1}))
			]
		),
		transition(
			':leave', [
			  style({'opacity': 1}),
			  animate('0.3s', style({'opacity': 0}))
			  
			]
		)
	]); 

export const slider_animation =
	trigger('trigger_slider', [
		state('hidden-r', style({
		  transform: 'translateX(100%)'
		})),
		state('hidden-l', style({
		  transform: 'translateX(-100%)'
		})),
		state('shown', style({
		  transform: 'translateX(0%)'
		})),
		transition('hidden-r => shown', animate('.5s 50ms ease-in', style({transform: 'translateX(0)'}))),
		transition('shown => hidden-l', animate('.5s 50ms ease-in', style({transform: 'translateX(-100%)'}))),
		transition('hidden-l => shown', animate('.5s 50ms ease-in', style({transform: 'translateX(0)'}))),
		transition('shown => hidden-r', animate('.5s 50ms ease-in', style({transform: 'translateX(100%)'})))
	]); 
