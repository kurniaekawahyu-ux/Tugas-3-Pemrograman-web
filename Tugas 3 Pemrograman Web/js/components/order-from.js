Vue.component('order-form', {
    template: '#tpl-order-form',
    data() {
        return {
            bahanAjar: [],
            cart: [],
            orderForm: {
                nim: '',
                nama: '',
                upbjj: '',
                alamat: '',
                telepon: ''
            },
            showOrderModal: false,
            upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"]
        };
    },
    async created() {
        await this.loadData();
    },
    computed: {
        totalHarga() {
            return this.cart.reduce((total, item) => total + (item.harga * item.qty), 0);
        },
        
        formattedTotal() {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(this.totalHarga);
        }
    },
    methods: {
        async loadData() {
            try {
                // Data dummy
                this.bahanAjar = [
                    {
                        kode: "EKMA4116",
                        judul: "Pengantar Manajemen",
                        kategori: "MK Wajib", 
                        upbjj: "Jakarta",
                        harga: 65000,
                        qty: 28,
                        safety: 20
                    },
                    {
                        kode: "EKMA4115",
                        judul: "Pengantar Akuntansi",
                        kategori: "MK Wajib",
                        upbjj: "Jakarta", 
                        harga: 60000,
                        qty: 7,
                        safety: 15
                    },
                    {
                        kode: "BIOL4201", 
                        judul: "Biologi Umum (Praktikum)",
                        kategori: "Praktikum",
                        upbjj: "Surabaya",
                        harga: 80000,
                        qty: 12,
                        safety: 10
                    }
                ];
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        
        addToCart(item) {
            const existingItem = this.cart.find(cartItem => cartItem.kode === item.kode);
            if (existingItem) {
                if (existingItem.qty < item.qty) {
                    existingItem.qty += 1;
                } else {
                    alert('Stok tidak mencukupi!');
                }
            } else {
                if (item.qty > 0) {
                    this.cart.push({
                        ...item,
                        qty: 1
                    });
                } else {
                    alert('Stok bahan ajar habis!');
                }
            }
        },
        
        removeFromCart(index) {
            this.cart.splice(index, 1);
        },
        
        updateQuantity(item, newQty) {
            if (newQty < 1) {
                this.removeFromCart(this.cart.indexOf(item));
            } else if (newQty <= item.stock) {
                item.qty = newQty;
            } else {
                alert('Stok tidak mencukupi!');
            }
        },
        
        clearCart() {
            this.cart = [];
        },
        
        submitOrder() {
            if (!this.validateOrder()) return;
            
            this.showOrderModal = true;
        },
        
        validateOrder() {
            if (this.cart.length === 0) {
                alert('Keranjang belanja kosong');
                return false;
            }
            
            if (!this.orderForm.nim.trim()) {
                alert('NIM harus diisi');
                return false;
            }
            
            if (!this.orderForm.nama.trim()) {
                alert('Nama harus diisi');
                return false;
            }
            
            if (!this.orderForm.upbjj) {
                alert('UT-Daerah harus dipilih');
                return false;
            }
            
            return true;
        },
        
        finishOrder() {
            // Reset form dan cart
            this.orderForm = {
                nim: '',
                nama: '',
                upbjj: '',
                alamat: '',
                telepon: ''
            };
            this.cart = [];
            this.showOrderModal = false;
            
            alert('Pesanan berhasil dibuat! Nomor DO akan di-generate otomatis.');
        },
        
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        },
        
        getStatus(item) {
            if (item.qty === 0) {
                return { text: 'Kosong', class: 'badge-danger' };
            } else if (item.qty < item.safety) {
                return { text: 'Menipis', class: 'badge-warning' };
            } else {
                return { text: 'Tersedia', class: 'badge-success' };
            }
        }
    }
});