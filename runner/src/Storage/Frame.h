#include "./Variable.h"
#include "../Core/List.h"

namespace Storage
{
  struct FrameVariable
  {
    char *name;
    Variable *value;
  };

  class Frame
  {
  public:
    Frame();
    Variable *search(char *name);
    Frame *add_variable(char *name, Variable *value);
    Frame *merge(const Frame *input);

  private:
    Core::List<FrameVariable *> data;
  };
}