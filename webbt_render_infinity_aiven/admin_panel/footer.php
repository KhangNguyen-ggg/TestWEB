    </main><!-- /.page-content -->
</div><!-- /#main-content -->

<!-- ── Footer bar ───────────────────────────────────────── -->
<footer style="
    margin-left: var(--sidebar-width);
    background: #fff;
    border-top: 1px solid #e2e8f0;
    padding: 14px 28px;
    font-size: 12px;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
" id="page-footer">
    <span>
        &copy; <?= date('Y') ?> <strong>VNVD</strong> — Nền tảng dịch vụ số toàn diện.
        Phát triển bởi đội ngũ VNVD Tech.
    </span>
    <span>
        <i class="fa-solid fa-code" style="color:#0d6efd"></i>
        PHP Native + MySQL (PDO) &nbsp;|&nbsp;
        <i class="fa-brands fa-bootstrap" style="color:#7952b3"></i>
        Bootstrap 5
    </span>
</footer>

<!-- ── Bootstrap 5 JS ───────────────────────────────────── -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<!-- ── Responsive footer margin ─────────────────────────── -->
<script>
(function () {
    function fixFooter() {
        var footer = document.getElementById('page-footer');
        if (!footer) return;
        footer.style.marginLeft = window.innerWidth < 992 ? '0' : 'var(--sidebar-width)';
    }
    fixFooter();
    window.addEventListener('resize', fixFooter);
})();
</script>

<!-- ── Auto-dismiss alerts after 4s ─────────────────────── -->
<script>
document.querySelectorAll('.alert-dismissible').forEach(function (el) {
    setTimeout(function () {
        var bsAlert = bootstrap.Alert.getOrCreateInstance(el);
        if (bsAlert) bsAlert.close();
    }, 4000);
});
</script>

</body>
</html>
