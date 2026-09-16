"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { PROJECT_CATEGORIES, STUDENT_COURSES } from "@/lib/admin/constants";
import type { SubmissionActionState } from "@/lib/submissions/action-state";
import {
  parseSubmissionFormData,
  validateSubmissionFiles,
} from "@/lib/submissions/parse-form";
import { validateSubmissionInput, type SubmissionType } from "@/lib/submissions/validate";

const MAX_GALLERY = 4;

type ImagePreview = {
  url: string;
  name: string;
};

type SubmissionFormProps = {
  action: (prev: SubmissionActionState, formData: FormData) => Promise<SubmissionActionState>;
};

const fieldLabel =
  "text-xs font-medium uppercase tracking-[0.14em] text-faint";

const inputClassName =
  "w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors placeholder:text-faint/70 focus:border-brand";

const selectClassName = clsx(
  inputClassName,
  "cursor-pointer appearance-none bg-[length:12px] bg-[position:right_0_center] bg-no-repeat pr-6",
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%235c7082' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")]",
);

const textareaClassName =
  "min-h-[148px] w-full resize-y border border-border bg-void/40 px-4 py-3 text-foreground outline-none transition-colors placeholder:text-faint/70 focus:border-brand";

const TYPE_OPTIONS: { value: SubmissionType; label: string; hint: string }[] = [
  {
    value: "producao",
    label: "Produção",
    hint: "Modelagem, concept, animação, ilustração…",
  },
  {
    value: "jogo",
    label: "Jogo",
    hint: "Protótipo ou jogo completo de Design de Games",
  },
];

function FieldGroup({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="relative flex flex-col gap-6 border-0 p-0">
      <legend className="mb-2 flex w-full items-start gap-5 border-b border-border pb-5 sm:gap-6">
        <span
          aria-hidden
          className="mt-0.5 shrink-0 font-display text-3xl leading-none text-brand/35 sm:text-4xl"
        >
          {step}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-display text-xl text-foreground sm:text-2xl">{title}</span>
          {description ? <span className="text-sm leading-relaxed text-muted">{description}</span> : null}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}

function ImagePreviewCard({ preview, large }: { preview: ImagePreview; large?: boolean }) {
  return (
    <figure
      className={
        large
          ? "relative aspect-[16/10] w-full overflow-hidden border border-border bg-void"
          : "relative aspect-square overflow-hidden border border-border bg-void"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
      <figcaption className="absolute inset-x-0 bottom-0 truncate bg-void/80 px-2 py-1.5 text-[10px] text-muted backdrop-blur-sm">
        {preview.name}
      </figcaption>
    </figure>
  );
}

function FileUploadZone({
  id,
  name,
  accept,
  required,
  multiple,
  title,
  hint,
  variant = "primary",
  onChange,
}: {
  id: string;
  name: string;
  accept: string;
  required?: boolean;
  multiple?: boolean;
  title: string;
  hint: string;
  variant?: "primary" | "secondary";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        "group flex cursor-pointer flex-col gap-3 border border-dashed px-5 py-8 transition-[border-color,background-color] duration-300 sm:px-8 sm:py-10",
        variant === "primary"
          ? "border-brand/25 bg-brand/[0.03] hover:border-brand/50 hover:bg-brand/[0.06]"
          : "border-border bg-void/20 hover:border-border-strong hover:bg-void/35",
      )}
    >
      <input
        id={id}
        type="file"
        name={name}
        accept={accept}
        required={required}
        multiple={multiple}
        onChange={onChange}
        className="sr-only"
      />
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className={clsx(
            "flex h-10 w-10 shrink-0 items-center justify-center border text-lg transition-colors",
            variant === "primary"
              ? "border-brand/30 bg-brand/10 text-brand group-hover:border-brand/50"
              : "border-border bg-surface-raised text-muted group-hover:border-border-strong",
          )}
        >
          ↑
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-faint">{hint}</span>
        </span>
      </span>
      <span className="text-xs text-faint group-hover:text-muted">
        Clique para escolher {multiple ? "arquivos" : "um arquivo"}
      </span>
    </label>
  );
}

function revokePreviews(previews: ImagePreview[]) {
  for (const preview of previews) {
    if (preview.url.startsWith("blob:")) URL.revokeObjectURL(preview.url);
  }
}

export default function SubmissionForm({ action }: SubmissionFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const currentYear = new Date().getFullYear();
  const restored = state.values;
  const [submissionType, setSubmissionType] = useState<SubmissionType>(
    restored?.submission_type ?? "producao",
  );
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [coverPreview, setCoverPreview] = useState<ImagePreview | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<ImagePreview[]>([]);
  const coverInputId = useId();
  const galleryInputId = useId();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const isGame = submissionType === "jogo";
  const formKey = state.restoreKey ?? "initial";
  const visibleError = clientError ?? state.error ?? null;

  useEffect(() => {
    if (!state.restoreKey || !state.values) return;
    setSubmissionType(state.values.submission_type);
  }, [state.restoreKey, state.values]);

  useEffect(() => {
    if (!visibleError) return;
    feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [visibleError, state.restoreKey]);

  useEffect(() => {
    return () => {
      if (coverPreview) revokePreviews([coverPreview]);
      revokePreviews(galleryPreviews);
    };
  }, [coverPreview, galleryPreviews]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    const formData = new FormData(event.currentTarget);
    formData.delete("cover_file");
    formData.delete("gallery_files");
    if (coverFile) formData.set("cover_file", coverFile);
    for (const file of galleryFiles) {
      formData.append("gallery_files", file);
    }

    const { input, coverFile: parsedCover, galleryFiles: parsedGallery } =
      parseSubmissionFormData(formData);

    const validationError = validateSubmissionInput(input);
    if (validationError) {
      setClientError(validationError);
      return;
    }

    const fileError = validateSubmissionFiles(input.submission_type, parsedCover, parsedGallery);
    if (fileError) {
      setClientError(fileError);
      return;
    }

    formAction(formData);
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (coverPreview) revokePreviews([coverPreview]);
    if (!file) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    setCoverFile(file);
    setCoverPreview({ url: URL.createObjectURL(file), name: file.name });
  }

  function handleGalleryChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, MAX_GALLERY);
    revokePreviews(galleryPreviews);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => ({ url: URL.createObjectURL(file), name: file.name })));
  }

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-6 border border-brand/30 bg-brand/[0.06] px-6 py-14 text-center sm:px-12 sm:py-16">
        <span
          aria-hidden
          className="flex h-14 w-14 items-center justify-center border border-brand/40 bg-brand/15 font-display text-2xl text-brand"
        >
          ✓
        </span>
        <div className="flex max-w-sm flex-col gap-3">
          <p className="font-display text-3xl text-foreground sm:text-4xl">Enviado!</p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">{state.success}</p>
        </div>
      </div>
    );
  }

  return (
    <form
      key={formKey}
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-14 sm:gap-16"
    >
      <input type="hidden" name="submission_type" value={submissionType} />

      {visibleError ? (
        <p
          ref={feedbackRef}
          role="alert"
          className="border border-red-500/35 bg-red-500/[0.08] px-4 py-3 text-sm leading-relaxed text-red-300"
        >
          {visibleError}
        </p>
      ) : (
        <div ref={feedbackRef} />
      )}

      <FieldGroup step="01" title="Tipo de trabalho" description="Escolha o que você quer enviar para revisão.">
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPE_OPTIONS.map((option) => {
            const selected = submissionType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSubmissionType(option.value)}
                className={clsx(
                  "flex flex-col gap-2 border px-5 py-4 text-left transition-colors",
                  selected
                    ? "border-brand bg-brand/[0.06]"
                    : "border-border bg-void/20 hover:border-border-strong hover:bg-void/35",
                )}
              >
                <span className="text-sm font-medium text-foreground">{option.label}</span>
                <span className="text-xs leading-relaxed text-faint">{option.hint}</span>
              </button>
            );
          })}
        </div>
      </FieldGroup>

      <FieldGroup step="02" title="Quem envia" description="Use seu e-mail institucional @fumec.br.">
        <div className="grid gap-8 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className={fieldLabel}>Nome completo</span>
            <input
              type="text"
              name="student"
              required
              autoComplete="name"
              defaultValue={restored?.student ?? ""}
              className={inputClassName}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={fieldLabel}>E-mail</span>
            <input
              type="email"
              name="student_email"
              required
              autoComplete="email"
              placeholder="seu.nome@fumec.br"
              defaultValue={restored?.student_email ?? ""}
              className={inputClassName}
            />
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className={fieldLabel}>Curso</span>
          <select
            name="student_course"
            required
            defaultValue={restored?.student_course ?? ""}
            className={selectClassName}
          >
            <option value="" disabled>
              Selecione seu curso
            </option>
            {STUDENT_COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>
      </FieldGroup>

      <FieldGroup
        step="03"
        title={isGame ? "Sobre o jogo" : "Sobre a produção"}
        description={isGame ? "Conte sobre a equipe, o gênero e onde o jogo roda." : undefined}
      >
        <label className="flex flex-col gap-2">
          <span className={fieldLabel}>Título</span>
          <input
            type="text"
            name="title"
            required
            defaultValue={restored?.title ?? ""}
            className={inputClassName}
          />
        </label>

        {isGame ? (
          <>
            <label className="flex flex-col gap-2">
              <span className={fieldLabel}>Equipe</span>
              <input
                type="text"
                name="team"
                placeholder="Nome do time ou deixe em branco se for solo"
                defaultValue={restored?.team ?? ""}
                className={inputClassName}
              />
              <span className="text-xs text-faint">Se estiver sozinho, usamos seu nome como equipe.</span>
            </label>
            <div className="grid gap-8 sm:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className={fieldLabel}>Gênero</span>
                <input
                  type="text"
                  name="genre"
                  required
                  placeholder="Puzzle, plataforma…"
                  defaultValue={restored?.genre ?? ""}
                  className={inputClassName}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={fieldLabel}>Plataforma</span>
                <input
                  type="text"
                  name="platform"
                  required
                  placeholder="PC, Web, Android…"
                  defaultValue={restored?.platform ?? ""}
                  className={inputClassName}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={fieldLabel}>Ano</span>
                <input
                  type="number"
                  name="year"
                  required
                  min={2000}
                  max={2100}
                  defaultValue={restored?.year ?? currentYear}
                  className={inputClassName}
                />
              </label>
            </div>
          </>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={fieldLabel}>Categoria</span>
              <select
                name="category"
                required
                defaultValue={restored?.category ?? PROJECT_CATEGORIES[0]}
                className={selectClassName}
              >
                {PROJECT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className={fieldLabel}>Ano</span>
              <input
                type="number"
                name="year"
                required
                min={2000}
                max={2100}
                defaultValue={restored?.year ?? currentYear}
                className={inputClassName}
              />
            </label>
          </div>
        )}

        <label className="flex flex-col gap-2">
          <span className={fieldLabel}>Descrição</span>
          <textarea
            name="description"
            required
            rows={6}
            placeholder={
              isGame
                ? "Pitch do jogo, mecânicas principais, ferramentas usadas e o que você quer destacar."
                : "Contexto do trabalho, técnicas usadas e o que você quer destacar."
            }
            defaultValue={restored?.description ?? ""}
            className={textareaClassName}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={fieldLabel}>Link externo</span>
          <input
            type="text"
            name="external_url"
            inputMode="url"
            autoComplete="url"
            placeholder={isGame ? "itch.io, Google Drive, vídeo de gameplay…" : "YouTube, Google Drive, ArtStation…"}
            defaultValue={restored?.external_url ?? ""}
            className={inputClassName}
          />
          <span className="text-xs text-faint">
            Opcional — {isGame ? "página do jogo, build para download ou vídeo." : "vídeo, pasta de arquivos ou página do projeto."}
          </span>
        </label>
      </FieldGroup>

      <FieldGroup
        step="04"
        title="Imagens"
        description={isGame ? "Capa obrigatória — screenshot ou arte promocional." : "Capa obrigatória. Até 4 imagens extras, opcionais."}
      >
        <div className="flex flex-col gap-4">
          <span className={fieldLabel}>Capa</span>
          <FileUploadZone
            id={coverInputId}
            name="cover_file"
            accept="image/jpeg,image/png,image/webp"
            title="Imagem de capa"
            hint="JPG, PNG ou WebP · até 10 MB"
            variant="primary"
            onChange={handleCoverChange}
          />
          {coverPreview ? <ImagePreviewCard preview={coverPreview} large /> : null}
        </div>

        {!isGame ? (
          <div className="flex flex-col gap-4">
            <span className={fieldLabel}>Galeria extra</span>
            <FileUploadZone
              id={galleryInputId}
              name="gallery_files"
              accept="image/jpeg,image/png,image/webp"
              multiple
              title="Até 4 imagens adicionais"
              hint="Mostre detalhes, processo ou variações do trabalho"
              variant="secondary"
              onChange={handleGalleryChange}
            />
            {galleryPreviews.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryPreviews.map((preview) => (
                  <ImagePreviewCard key={preview.url} preview={preview} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </FieldGroup>

      <div className="flex flex-col gap-8 border-t border-border pt-8">
        <label className="flex cursor-pointer items-start gap-4 border border-border bg-void/25 p-5 transition-colors has-[:checked]:border-brand/35 has-[:checked]:bg-brand/[0.05] sm:p-6">
          <input
            type="checkbox"
            name="authorization"
            required
            defaultChecked={restored?.authorization ?? false}
            className="mt-0.5 h-4 w-4 shrink-0 appearance-none border border-border bg-transparent checked:border-brand checked:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          />
          <span className="text-sm leading-relaxed text-muted">
            Autorizo a FUMEC Criativa a exibir este trabalho no site institucional dos cursos, com
            crédito ao meu nome{isGame ? " e da equipe" : ""}.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            Campos marcados são obrigatórios. E-mail deve ser @fumec.br.
          </p>
          <PrimaryButton type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Enviando…" : isGame ? "Enviar jogo" : "Enviar produção"}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
