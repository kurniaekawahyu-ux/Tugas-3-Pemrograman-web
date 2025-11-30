Vue.component('ba-stock-table', {
    template: '#tpl-stock-table',
    data() {
        return {
            bahanAjar: [],
            upbjjList: [],
            kategoriList: [],
            filteredBahanAjar: [],
            filters: {
                upbjj: '',
                kategori: '',
                stokRendah: false,
                stokKosong: false
            },
            sortBy: 'judul',
            sortDirection: 'asc',
            showForm: false,
            editingItem: null,
            formData: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: '',
                qty: '',
                safety: '',
                catatanHTML: ''
            },
            showDeleteModal: false,
            itemToDelete: null
        };
    },
    async created() {
        await this.loadData();
    },
    computed: {
        sortedAndFilteredBahanAjar() {
            let result = [...this.filteredBahanAjar];
            
            // Sorting
            result.sort((a, b) => {
                let aVal = a[this.sortBy];
                let bVal = b[this.sortBy];
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
            
            return result;
        }
    },
    methods: {
        async loadData() {
            try {
                // Data dummy - nanti ganti dengan API
                this.bahanAjar = [
                    {
                        kode: "EKMA4116",
                        judul: "Pengantar Manajemen",
                        kategori: "MK Wajib",
                        upbjj: "Jakarta",
                        lokasiRak: "R1-A3",
                        harga: 65000,
                        qty: 28,
                        safety: 20,
                        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
                    },
                    {
                        kode: "EKMA4115",
                        judul: "Pengantar Akuntansi", 
                        kategori: "MK Wajib",
                        upbjj: "Jakarta",
                        lokasiRak: "R1-A4",
                        harga: 60000,
                        qty: 7,
                        safety: 15,
                        catatanHTML: "<strong>Cover baru</strong>"
                    },
                    {
                        kode: "BIOL4201",
                        judul: "Biologi Umum (Praktikum)",
                        kategori: "Praktikum", 
                        upbjj: "Surabaya",
                        lokasiRak: "R3-B2",
                        harga: 80000,
                        qty: 12,
                        safety: 10,
                        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
                    },
                    {
                        kode: "FISIP4001",
                        judul: "Dasar-Dasar Sosiologi",
                        kategori: "MK Pilihan",
                        upbjj: "Makassar", 
                        lokasiRak: "R2-C1",
                        harga: 55000,
                        qty: 2,
                        safety: 8,
                        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
                    },
                    {
                        kode: "MATH4101",
                        judul: "Matematika Dasar",
                        kategori: "MK Wajib",
                        upbjj: "Denpasar",
                        lokasiRak: "R1-B1", 
                        harga: 70000,
                        qty: 0,
                        safety: 10,
                        catatanHTML: "Stok habis, cetak ulang sedang proses"
                    }
                ];
                
                this.upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];
                this.kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];
                this.applyFilters();
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        
        applyFilters() {
            this.filteredBahanAjar = this.bahanAjar.filter(item => {
                // Filter UT-Daerah
                if (this.filters.upbjj && item.upbjj !== this.filters.upbjj) {
                    return false;
                }
                
                // Filter Kategori
                if (this.filters.kategori && item.kategori !== this.filters.kategori) {
                    return false;
                }
                
                // Filter Stok Rendah
                if (this.filters.stokRendah && item.qty >= 20) {
                    return false;
                }
                
                // Filter Stok Kosong
                if (this.filters.stokKosong && item.qty > 0) {
                    return false;
                }
                
                return true;
            });
        },
        
        resetFilters() {
            this.filters = {
                upbjj: '',
                kategori: '',
                stokRendah: false,
                stokKosong: false
            };
            this.applyFilters();
        },
        
        sortData(field) {
            if (this.sortBy === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = field;
                this.sortDirection = 'asc';
            }
        },
        
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(value);
        },
        
        formatQuantity(value) {
            return `${value} buah`;
        },
        
        getStatus(item) {
            if (item.qty === 0) {
                return { text: 'Kosong', class: 'badge-danger', icon: '❌' };
            } else if (item.qty < item.safety) {
                return { text: 'Menipis', class: 'badge-warning', icon: '⚠️' };
            } else {
                return { text: 'Aman', class: 'badge-success', icon: '✅' };
            }
        },
        
        openAddForm() {
            this.editingItem = null;
            this.formData = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: '',
                qty: '',
                safety: '',
                catatanHTML: ''
            };
            this.showForm = true;
        },
        
        openEditForm(item) {
            this.editingItem = item;
            this.formData = { ...item };
            this.showForm = true;
        },
        
        saveItem() {
            if (this.editingItem) {
                // Update existing item
                const index = this.bahanAjar.findIndex(item => item.kode === this.editingItem.kode);
                if (index !== -1) {
                    this.bahanAjar.splice(index, 1, { ...this.formData });
                }
            } else {
                // Add new item
                this.bahanAjar.push({ ...this.formData });
            }
            
            this.applyFilters();
            this.showForm = false;
        },
        
        confirmDelete(item) {
            this.itemToDelete = item;
            this.showDeleteModal = true;
        },
        
        deleteItem() {
            if (this.itemToDelete) {
                const index = this.bahanAjar.findIndex(item => item.kode === this.itemToDelete.kode);
                if (index !== -1) {
                    this.bahanAjar.splice(index, 1);
                    this.applyFilters();
                }
            }
            this.showDeleteModal = false;
            this.itemToDelete = null;
        },
        
        handleKeydown(event) {
            if (event.key === 'Enter') {
                this.saveItem();
            }
        }
    },
    watch: {
        filters: {
            handler() {
                this.applyFilters();
            },
            deep: true
        }
    }
});