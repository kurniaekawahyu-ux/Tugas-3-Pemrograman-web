Vue.component('do-tracking', {
    template: '#tpl-tracking',
    data() {
        return {
            deliveryOrders: [],
            searchQuery: '',
            searchResults: [],
            showModal: false,
            showDetailModal: false,
            formData: {
                nim: '',
                nama: '',
                ekspedisi: 'JNE',
                paketKode: '',
                tanggalKirim: new Date().toISOString().split('T')[0]
            },
            selectedPaket: null,
            selectedDO: null,
            newStatus: { keterangan: '' },
            pengirimanList: [
                { kode: "REG", nama: "JNE Reguler (3-5 hari)" },
                { kode: "EXP", nama: "JNE Express (1-2 hari)" }
            ],
            paketList: [
                { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
                { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
            ],
            stok: []
        };
    },
    async created() {
        await this.loadData();
    },
    computed: {
        nextDONumber() {
            if (this.deliveryOrders.length === 0) return 'DO2025-001';
            
            const lastDO = this.deliveryOrders[this.deliveryOrders.length - 1];
            const match = lastDO.noDO.match(/DO(\d+)-(\d+)/);
            if (match) {
                const year = match[1];
                const sequence = parseInt(match[2]) + 1;
                return `DO${year}-${sequence.toString().padStart(3, '0')}`;
            }
            return 'DO2025-001';
        },
        
        totalHarga() {
            if (!this.selectedPaket) return 0;
            return this.selectedPaket.harga;
        }
    },
    methods: {
        async loadData() {
            try {
                // Data dummy
                this.deliveryOrders = [
                    {
                        noDO: "DO2025-001",
                        nim: "123456789",
                        nama: "Rina Wulandari",
                        ekspedisi: "JNE Express (1-2 hari)",
                        paket: { 
                            kode: "PAKET-UT-001", 
                            nama: "PAKET IPS Dasar", 
                            harga: 120000,
                            isi: ["EKMA4116","EKMA4115"]
                        },
                        tanggalKirim: "2025-08-25",
                        totalHarga: 120000,
                        status: "Dalam Perjalanan",
                        perjalanan: [
                            { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                            { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                            { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
                        ]
                    },
                    {
                        noDO: "DO2025-002",
                        nim: "987654321", 
                        nama: "Budi Santoso",
                        ekspedisi: "JNE Reguler (3-5 hari)",
                        paket: {
                            kode: "PAKET-UT-002",
                            nama: "PAKET IPA Dasar",
                            harga: 140000,
                            isi: ["BIOL4201","FISIP4001"]
                        },
                        tanggalKirim: "2025-08-24",
                        totalHarga: 140000,
                        status: "Selesai",
                        perjalanan: [
                            { waktu: "2025-08-24 09:30:15", keterangan: "Pesanan diproses" },
                            { waktu: "2025-08-24 14:20:30", keterangan: "Paket dikirim" },
                            { waktu: "2025-08-27 10:15:00", keterangan: "Paket diterima mahasiswa" }
                        ]
                    }
                ];
                
                this.stok = [
                    { kode: "EKMA4116", judul: "Pengantar Manajemen" },
                    { kode: "EKMA4115", judul: "Pengantar Akuntansi" },
                    { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)" },
                    { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi" }
                ];
                
                this.searchResults = [...this.deliveryOrders];
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },
        
        search() {
            if (!this.searchQuery.trim()) {
                this.searchResults = [...this.deliveryOrders];
                return;
            }
            
            const query = this.searchQuery.toLowerCase();
            this.searchResults = this.deliveryOrders.filter(doItem => 
                doItem.noDO.toLowerCase().includes(query) ||
                doItem.nim.toLowerCase().includes(query) ||
                doItem.nama.toLowerCase().includes(query)
            );
        },
        
        clearSearch() {
            this.searchQuery = '';
            this.searchResults = [...this.deliveryOrders];
        },
        
        handleKeydown(event) {
            if (event.key === 'Enter') {
                this.search();
            } else if (event.key === 'Escape') {
                this.clearSearch();
            }
        },
        
        showAddForm() {
            this.formData = {
                nim: '',
                nama: '',
                ekspedisi: 'JNE',
                paketKode: '',
                tanggalKirim: new Date().toISOString().split('T')[0]
            };
            this.selectedPaket = null;
            this.showModal = true;
        },
        
        closeModal() {
            this.showModal = false;
            this.selectedPaket = null;
        },
        
        updatePaketDetails() {
            this.selectedPaket = this.paketList.find(p => p.kode === this.formData.paketKode);
        },
        
        saveDO() {
            if (!this.validateForm()) return;
            
            const newDO = {
                noDO: this.nextDONumber,
                nim: this.formData.nim,
                nama: this.formData.nama,
                ekspedisi: this.formData.ekspedisi,
                paket: {
                    kode: this.selectedPaket.kode,
                    nama: this.selectedPaket.nama,
                    harga: this.selectedPaket.harga,
                    isi: [...this.selectedPaket.isi]
                },
                tanggalKirim: this.formData.tanggalKirim,
                totalHarga: this.selectedPaket.harga,
                status: 'Dalam Proses',
                perjalanan: [{
                    waktu: new Date().toLocaleString('id-ID'),
                    keterangan: 'Pesanan dibuat dan diproses'
                }]
            };
            
            this.deliveryOrders.push(newDO);
            this.searchResults = [...this.deliveryOrders];
            this.showModal = false;
            
            alert('DO berhasil ditambahkan!');
        },
        
        validateForm() {
            if (!this.formData.nim.trim()) {
                alert('NIM harus diisi');
                return false;
            }
            if (!this.formData.nama.trim()) {
                alert('Nama harus diisi');
                return false;
            }
            if (!this.formData.ekspedisi) {
                alert('Ekspedisi harus dipilih');
                return false;
            }
            if (!this.formData.paketKode) {
                alert('Paket bahan ajar harus dipilih');
                return false;
            }
            return true;
        },
        
        viewDetails(doItem) {
            this.selectedDO = { ...doItem };
            this.showDetailModal = true;
        },
        
        closeDetailModal() {
            this.showDetailModal = false;
            this.selectedDO = null;
            this.newStatus.keterangan = '';
        },
        
        addStatus() {
            if (!this.newStatus.keterangan.trim()) return;
            
            const status = {
                waktu: new Date().toLocaleString('id-ID'),
                keterangan: this.newStatus.keterangan
            };
            
            this.selectedDO.perjalanan.push(status);
            this.newStatus.keterangan = '';
        },
        
        getMataKuliahName(kodeMk) {
            const mataKuliah = this.stok.find(item => item.kode === kodeMk);
            return mataKuliah ? mataKuliah.judul : kodeMk;
        },
        
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        },
        
        formatDateTime(dateTimeString) {
            if (!dateTimeString) return '';
            const date = new Date(dateTimeString.replace(' ', 'T'));
            return date.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        formatCurrency(value) {
            return new Intl.NumberFormat('id-ID').format(value);
        },
        
        getStatusClass(status) {
            switch(status) {
                case 'Selesai': return 'status-selesai';
                case 'Dalam Perjalanan': return 'status-perjalanan';
                case 'Dalam Proses': return 'status-proses';
                default: return 'status-proses';
            }
        }
    },
    watch: {
        searchQuery() {
            this.search();
        }
    }
});