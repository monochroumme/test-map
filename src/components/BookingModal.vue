<template>
	<div class="custom-modal booking-modal">
		<div class="custom-modal__bg" @click="closeModal"></div>
		<div class="custom-modal__card booking-modal__card">
			<button class="custom-modal__card__close" @click="closeModal"></button>
			<div class="custom-modal__card__content">
				<h2 class="custom-modal__card__title">Бронирование места в {{ event.title }}</h2>
				<div class="booking-modal__info">
					<div class="booking-modal__info__left">
						<p class="custom-modal__card__desc">{{ seat.details }}</p>
						<div class="booking-modal__card__place">
							<div class="booking-modal__card__place__row">
								<span class="title">Ряд: </span>
								<span class="value">{{ seat.row_number }}</span>
							</div>
							<div class="booking-modal__card__place__row">
								<span class="title">Место: </span>
								<span class="value">{{ seat.seat_number }}</span>
							</div>
						</div>
						<div class="custom-modal__card__date">
							<span class="custom-modal__card__date__title">Время проведения:</span>
							<span class="custom-modal__card__date__value">{{ event.startsAt | moment('HH:mm DD.MM.YY') }} ‒ {{ event.endsAt | moment('HH:mm DD.MM.YY') }}</span>
						</div>
						<div class="booking-modal__card__price">
							<span class="title">Цена: </span>
							<span class="value">{{ seat.price }}₽</span>
						</div>
					</div>
					<div class="booking-modal__info__right">
						<div class="logo" @click="chooseImg">
							<div class="center" v-if="!logo">
								<img src="../static/svg/camera.svg">
							</div>
							<img :src="logoSrc" class="image" :class="{chosen: logo}">
							<input v-show="false" type="file" accept="image" name="image" @change="uploadImage" ref="imageLoader">
						</div>
					</div>
				</div>
				<form class="booking-modal__form" @submit.prevent="submit">
					<input type="text" name="company" placeholder="*Название компании" required v-model="name" maxlength="255">
					<input type="text" name="name" placeholder="*Контактное лицо" required v-model="admin" maxlength="255">
					<input type="email" name="email" placeholder="*Email" required v-model="email" maxlength="255">
					<input type="tel" name="phone" placeholder="*Телефон" required v-model="phone" maxlength="255">
					<textarea v-model="details" maxlength="255" placeholder="Описание" name="details"></textarea>
					<button type="submit">Забронировать</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
	props: ['seat', 'event'],

	data() {
		return {
			name: '',
			admin: '',
			email: '',
			phone: '',
			details: '',
			logo: null,
			logoSrc: ''
		}
	},

	methods: {
		...mapActions(['bookPlace']),

		closeModal() {
			this.$emit('close-modal');
		},

		chooseImg() {
    	this.$refs.imageLoader.click();
    },

    uploadImage() {
      if (this.$refs.imageLoader) {
        this.logo = this.$refs.imageLoader.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.logoSrc = e.target.result;
        }
        reader.readAsDataURL(this.$refs.imageLoader.files[0]);
      } else console.error('Cannot find image loader');
    },

		async submit() {
			if (!this.logo) {
				this.$toasted.error('Выберите лого', {position: 'top-center', duration: 3000})
				return;
			}

			await this.bookPlace({
			 	name: this.name,
        admin: this.admin,
        email: this.email,
        phone: this.phone,
        details: this.details,
        logo: this.logo,
        id: this.seat.id
			}).then(() => {
				this.closeModal();
			}).catch(e => {});
		}
	}
}
</script>
